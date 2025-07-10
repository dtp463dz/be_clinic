const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Hàm thiết kế PDF
const designPDF = (doc, data) => {
    // Nhúng font hỗ trợ tiếng Việt (Roboto)
    const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');
    doc.registerFont('Roboto', fontPath);
    doc.font('Roboto');

    // Thêm logo
    const logoPath = path.join(__dirname, '../templates/logo.png');
    if (fs.existsSync(logoPath)) {
        // Hiển thị kích thước hợp lý dù ảnh lớn
        doc.image(logoPath, 40, 20, {
            fit: [50, 50], // Giới hạn kích thước hiển thị tối đa
            align: 'left',
            valign: 'top'
        });
    }

    // Tên hệ thống
    doc.fontSize(12).fillColor('#000000')
        .text('Hệ thống đặt lịch khám Booking Health', 150, 40, { align: 'center' });

    // Tiêu đề
    doc.fontSize(24).fillColor('#000000')
        .text('PHIẾU KHÁM BỆNH', { align: 'center' })
        .moveDown(0.5);
    doc.lineWidth(1).moveTo(40, 90).lineTo(555, 90).stroke();

    // Bảng thông tin
    const tableTop = 110;
    const leftX = 50;
    const rightX = 305;
    const lineSpacing = 20;

    // Header
    doc.fontSize(12).fillColor('#757575')
        .text('Thông tin bệnh nhân', leftX, tableTop)
        .text('Thông tin khám', rightX, tableTop);
    doc.fillColor('black').fontSize(10);


    // Dữ liệu cột trái (Thông tin bệnh nhân)
    doc.text(`Họ tên: ${data.patientName}`, leftX, tableTop + lineSpacing)
        .text(`Email: ${data.patientEmail || 'N/A'}`, leftX, tableTop + lineSpacing * 2)
        .text(`SĐT: ${data.patientPhone || 'N/A'}`, leftX, tableTop + lineSpacing * 3)
        .text(`Địa chỉ: ${data.patientAddress || 'N/A'}`, leftX, tableTop + lineSpacing * 4)
        .text(`Giới tính: ${data.gender || 'N/A'}`, leftX, tableTop + lineSpacing * 5);

    // Dữ liệu cột phải (Thông tin khám)
    doc.text(`Mã lịch khám: ${data.bookingId}`, rightX, tableTop + lineSpacing)
        .text(`Ngày khám: ${data.bookingDate}`, rightX, tableTop + lineSpacing * 2)
        .text(`Khung giờ: ${data.timeType || 'N/A'}`, rightX, tableTop + lineSpacing * 3);

    // Thông tin bác sĩ trong khung riêng
    const doctorBoxTop = tableTop + lineSpacing * 7;
    doc.lineWidth(1).rect(40, doctorBoxTop, 515, 80).stroke();
    doc.fontSize(12).text('Thông tin bác sĩ', 50, doctorBoxTop + 10).moveDown(0.5);
    doc.fontSize(10)
        .text(`Bác sĩ: ${data.doctorName}`, 50, doctorBoxTop + 30)
        .text(`Phòng khám: ${data.clinicName || 'N/A'}`, 50, doctorBoxTop + 45)
        .text(`Địa chỉ phòng khám: ${data.clinicAddress || 'N/A'}`, 50, doctorBoxTop + 60);

    const signatureTop = doctorBoxTop + 100;
    const currentDate = getCurrentDate();

    // Hà Nội, ngày ... (trên cùng 1 dòng, căn phải)
    doc.fontSize(10).text(`Hà Nội, ngày ${currentDate}`, 400, signatureTop, { align: 'right' });

    // Chữ ký
    const lineY = signatureTop + 30;
    doc.fontSize(10)
        .text('Chữ ký bác sĩ:', 50, lineY)
        .moveTo(130, lineY + 10).lineTo(230, lineY + 10).stroke()
        .text('Chữ ký người khám:', 330, lineY)
        .moveTo(440, lineY + 10).lineTo(540, lineY + 10).stroke();


};

// Hàm lấy ngày hiện tại theo định dạng ngày/tháng/năm
const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

// Hàm xuất PDF
const generatePDF = (data, outputFilePath) => {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputFilePath);
    doc.pipe(stream);

    designPDF(doc, data);

    doc.end();
    return new Promise((resolve) => {
        stream.on('finish', () => resolve());
    });
};

module.exports = { generatePDF };