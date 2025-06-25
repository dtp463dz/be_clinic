const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../models');

let generatePatientPDFService = async (bookingId) => {
    try {
        // 1. Truy xuất dữ liệu
        const booking = await db.Booking.findOne({
            where: { id: bookingId, statusId: 'S2' }, // Trạng thái đã khám
            attributes: ['id', 'date', 'timeType', 'doctorId', 'patientId', 'statusId'],
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['firstName', 'lastName', 'email', 'address', 'phonenumber', 'gender'],
                    include: [
                        { model: db.Allcode, as: 'genderData', attributes: ['valueVi'] }
                    ]
                },
                {
                    model: db.Allcode,
                    as: 'timeTypeDataPatient',
                    attributes: ['valueVi']
                }
            ],
            raw: true,
            nest: true
        });

        if (!booking) {
            return { errCode: 1, errMessage: 'Không tìm thấy thông tin khám đã hoàn tất' };
        }

        const doctor = await db.User.findOne({
            where: { id: booking.doctorId },
            attributes: ['firstName', 'lastName'],
            include: [
                {
                    model: db.Doctor_Infor,
                    attributes: ['nameClinic', 'addressClinic']
                }
            ],
            raw: true,
            nest: true
        });

        // 2. Chuẩn bị tạo PDF
        const pdfDir = path.join(__dirname, '../../public/pdfs');
        const fileName = `medical_record_${booking.id}.pdf`;
        const filePath = path.join(pdfDir, fileName);

        fs.mkdirSync(pdfDir, { recursive: true });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // ✅ Nhúng font Roboto có hỗ trợ tiếng Việt
        const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');
        doc.registerFont('Roboto', fontPath);
        doc.font('Roboto'); // sử dụng font Roboto cho toàn bộ nội dung

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 3. Viết nội dung PDF
        doc.fontSize(20).text('PHIẾU KHÁM BỆNH', { align: 'center' }).moveDown();

        doc.fontSize(14).text(`Mã lịch khám: ${booking.id}`);
        // doc.text(`Ngày khám: ${booking.date}`);
        doc.text(`Khung giờ: ${booking.timeTypeDataPatient?.valueVi || 'N/A'}`).moveDown();

        doc.fontSize(16).text('Thông tin bệnh nhân').moveDown(0.3);
        doc.fontSize(12).text(`Họ tên: ${booking.patientData.firstName} ${booking.patientData.lastName}`);
        doc.text(`Email: ${booking.patientData.email}`);
        doc.text(`Số điện thoại: ${booking.patientData.phonenumber}`);
        doc.text(`Địa chỉ: ${booking.patientData.address}`);
        doc.text(`Giới tính: ${booking.patientData.genderData?.valueVi || 'N/A'}`).moveDown();

        doc.fontSize(16).text('Thông tin bác sĩ').moveDown(0.3);
        doc.fontSize(12).text(`Bác sĩ: ${doctor.firstName} ${doctor.lastName}`);
        doc.text(`Phòng khám: ${doctor.Doctor_Infor?.nameClinic || 'N/A'}`);
        doc.text(`Địa chỉ phòng khám: ${doctor.Doctor_Infor?.addressClinic || 'N/A'}`);

        doc.end();

        return {
            errCode: 0,
            errMessage: 'Tạo file PDF thành công',
            fileUrl: `/pdfs/${fileName}`
        };
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        return { errCode: -1, errMessage: 'Lỗi server khi tạo PDF' };
    }
};

module.exports = {
    generatePatientPDFService
};
