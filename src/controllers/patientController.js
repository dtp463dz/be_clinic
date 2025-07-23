import patientService from "../services/patientService";

// dat lich kham
let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointmentService(req.body);
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