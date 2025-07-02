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

// xóa chuyên khoa 
let handleDeleteSpecialty = async (req, res) => {
    const specialtyId = req.body.id;
    if (!specialtyId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Thiếu tham số id chuyên khoa!'
        });
    }
    try {
        let message = await specialtyService.handleDeleteSpecialtyService(specialtyId);
        return res.status(message.errCode === 0 ? 200 : 404).json(message);
    } catch (e) {
        return res.status(500).json({
            errCode: 3,
            errMessage: 'Lỗi server khi xóa phòng khám'
        });
    }
}

// chỉnh sửa chuyên khoa
let handleEditspecialty = async (req, res) => {
    let data = req.body;
    let message = await specialtyService.updateSpecialtyService(data);
    return res.status(200).json(message);
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleEditspecialty: handleEditspecialty,

} 