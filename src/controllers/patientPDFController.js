import patientPDFService from "../services/patientPDFService";
const path = require('path');
const fs = require('fs');

let generatePatientPDF = async (req, res) => {
    try {
        const bookingId = req.query.bookingId;
        if (!bookingId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Missing required parameter: bookingId'
            });
        }
        const response = await patientPDFService.generatePatientPDFService(bookingId);
        if (response.errCode !== 0) {
            return res.status(400).json(response);
        }
        // Đường dẫn đến file PDF
        const filePath = path.join(__dirname, '../../public', response.fileUrl);

        // Kiểm tra file tồn tại
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                errCode: 2,
                errMessage: 'Không tìm thấy file PDF'
            });
        }
        // gửi file về FE dưới dạng PDF(stream)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=medical_record_${bookingId}.pdf`);
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })

    }
}

module.exports = {
    generatePatientPDF: generatePatientPDF

} 