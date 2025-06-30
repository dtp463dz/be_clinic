import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
    try {
        let response = await clinicService.createClinicService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })

    }
}

// Lấy tất cả phòng khám
let getAllClinic = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let response = await clinicService.getAllClinicService(page, limit);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}
// lấy phòng khám bằng id
let getDetailClinicById = async (req, res) => {
    try {
        let response = await clinicService.getDetailClinicByIdService(req.query.id);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

// Xóa phòng khám 
let handleDeleteClinic = async (req, res) => {
    const clinicId = req.body.id;
    if (!clinicId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Thiếu tham số id phòng khám!'
        });
    }
    try {
        let message = await clinicService.handleDeleteClinicService(clinicId);
        return res.status(message.errCode === 0 ? 200 : 404).json(message);
    } catch (e) {
        return res.status(500).json({
            errCode: 3,
            errMessage: 'Lỗi server khi xóa phòng khám'
        });
    }
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    handleDeleteClinic: handleDeleteClinic,


} 