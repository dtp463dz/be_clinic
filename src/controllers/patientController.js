import patientService from "../services/patientService";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// dat lich kham
let postBookAppointment = async (req, res) => {
    try {
        let user = null;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            // xác thực đã có
            try {
                user = jwt.verify(token, process.env.JWT_SECRET);
                if (user.roleId !== 'R3') {
                    return res.status(403).json({
                        errCode: 3,
                        message: 'Chỉ bệnh nhân (R3) mới có quyền đặt lịch'
                    });
                }
            } catch (error) {
                console.log('Invalid token: ', error);
                return res.status(403).json({
                    errCode: 2,
                    message: 'Token không hợp lệ hoặc đã hết hạn'
                });
            }
        }
        let response = await patientService.postBookAppointmentService({
            ...req.body,
            patientId: user ? user.userId : null,
            email: user ? user.email : req.body.email
        });
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// xac nhan lich kham
let postVerifyBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// huy lich kham
let cancelAppointment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const userId = req.user.userId; // lấy userId từ JWT token
        if (!bookingId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Thiếu tham số bắt buộc: bookingId'
            });
        }
        let response = await patientService.cancelAppointmentService(bookingId, userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Lỗi từ server...'
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    cancelAppointment: cancelAppointment,

}