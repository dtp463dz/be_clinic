import symptomService from "../services/symptomService.js";

let createSymptom = async (req, res) => {
    try {
        let response = await symptomService.createSymptomService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);

    } catch (e) {
        console.error("Create symptom error: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi tạo triệu chứng",
        });
    }
}

let getAllSymptom = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await symptomService.getAllSymptomService(page, limit);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        console.error("Lỗi controller getAllSymptom: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi lấy triệu chứng",
        });
    }
}

let getSymptomById = async (req, res) => {
    try {
        const id = req.query.id;
        const response = await symptomService.getSymptomByIdService(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller getSymptomById: ", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi lấy triệu chứng",
        });
    }
}

let updateSymptom = async (req, res) => {
    try {
        const response = await symptomService.updateSymptomService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller updateSymptom:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let deleteSymptom = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await symptomService.deleteSymptomService(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller deleteSymptom:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

module.exports = {
    createSymptom: createSymptom,
    getAllSymptom: getAllSymptom,
    getSymptomById: getSymptomById,
    updateSymptom: updateSymptom,
    deleteSymptom: deleteSymptom,

} 