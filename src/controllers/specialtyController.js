import specialtyService from "../services/specialtyService";

// tạo mới chuyên khoa
let createSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createSpecialtyService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

// Lấy tất cả chuyên khoa
let getAllSpecialty = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let response = await specialtyService.getAllSpecialtyService(page, limit);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

// chi tiet chuyen khoa theo id
let getDetailSpecialtyById = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
} 