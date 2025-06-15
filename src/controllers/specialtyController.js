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
        let response = await specialtyService.getAllSpecialtyService();
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
} 