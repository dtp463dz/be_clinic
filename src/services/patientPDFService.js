const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../models');
import { generatePDF } from '../utils/pdfDesign';

// Hàm chuyển timestamp sang định dạng dd/mm/yyyy
const formatDate = (timestamp) => {
    if (!timestamp || isNaN(timestamp)) return 'N/A';
    const date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) return 'N/A';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

let generatePatientPDFService = async (bookingId) => {
    try {
        // 1. Truy xuất dữ liệu
        const booking = await db.Booking.findOne({
            where: { id: bookingId, statusId: 'S2' },
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
        const pdfData = {
            patientName: `${booking.patientData.firstName} ${booking.patientData.lastName}`,
            patientEmail: booking.patientData.email,
            patientPhone: booking.patientData.phonenumber,
            patientAddress: booking.patientData.address,
            gender: booking.patientData.genderData?.valueVi || 'N/A',
            bookingId: booking.id,
            bookingDate: formatDate(booking.date),
            timeType: booking.timeTypeDataPatient?.valueVi || 'N/A',
            doctorName: `${doctor.firstName} ${doctor.lastName}`,
            clinicName: doctor.Doctor_Infor?.nameClinic || 'N/A',
            clinicAddress: doctor.Doctor_Infor?.addressClinic || 'N/A'
        };

        // 3. Thiết kế PDF
        const pdfDir = path.join(__dirname, '../../public/pdfs');
        const fileName = `medical_record_${booking.id}.pdf`;
        const filePath = path.join(pdfDir, fileName);

        fs.mkdirSync(pdfDir, { recursive: true });

        await generatePDF(pdfData, filePath);

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