import doctorService from "../services/doctorService";

// lay thong tin doctor home
let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHomeService(+limit) // +convert string sang number
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// get all doctor
let getAllDoctor = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorService();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// luu thong tin doctors
let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
// get detail doctor by id
let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })
    }
}

// bulk create schedule
let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })
    }
}

// get schedule doctor by date
let getScheduleDoctorByDate = async (req, res) => {
    try {
        let response = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })
    }
}

// get extra infor doctor by id : lấy thông tin mở rộng của bác sĩ
let getExtraInforDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })
    }
}

// get profile doctor by id 
let getProfileDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getProfileDoctorByIdService(req.query.doctorId);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })

    }
}
// lấy danh sách bệnh nhân từ bác sĩ
let getListPatientForDoctor = async (req, res) => {
    try {
        let { doctorId, date, page, limit } = req.query;
        let response = await doctorService.getListPatientForDoctorService(doctorId, date, page, limit);
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })

    }
}

// lưu thông tin modal hóa đơn khám bệnh 
let sendConfirm = async (req, res) => {
    try {
        let response = await doctorService.sendConfirmService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server !!!'
        })

    }
}

// bác sĩ hủy lịch khám
let cancelConfirm = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const doctorId = req.user.userId; // Lấy doctorId từ JWT token
        if (!bookingId) {
            return res.status(400).json({
                errCode: 1,
                message: 'Thiếu tham số bắt buộc: bookingId'
            });
        }
        let response = await doctorService.cancelConfirmService(bookingId, doctorId);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Lỗi từ server !!!'
        })
    }
}

// lay thong bao cho bác sĩ
let getDoctorNotifications = async (req, res) => {
    try {
        const doctorId = req.user.userId;
        if (!doctorId) {
            return res.status(400).json({
                errCode: -1,
                message: 'Thiếu doctorId'
            });
        }
        let response = await doctorService.getDoctorNotificaitons(doctorId);
        return res.status(200).json(response);
    } catch (e) {
        console.log('Error in getDoctorNotifications: ', e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    postInforDoctors: postInforDoctors,
    getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientForDoctor: getListPatientForDoctor,
    sendConfirm: sendConfirm,
    cancelConfirm: cancelConfirm,
    getDoctorNotifications: getDoctorNotifications,
}