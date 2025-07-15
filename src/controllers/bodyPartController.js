import bodyPartService from "../services/bodyPartService.js";

let createPart = async (req, res) => {
    try {
        const response = await bodyPartService.createPartService(req.body);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({
            errCode: -1, errMessage: "Lỗi server nội bộ"
        });
    }
}

let getAllParts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await bodyPartService.getAllPartsService(page, limit);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller getAllParts: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi lấy triệu chứng",
        });
    }
}

let getPartById = async (req, res) => {
    try {
        const response = await bodyPartService.getPartByIdService(req.query.id);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller getPartById:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let updatePart = async (req, res) => {
    try {
        const response = await bodyPartService.updatePartService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller updatePart:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let deletePart = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await bodyPartService.deletePartService(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller deletePart:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}
module.exports = {
    createPart: createPart,
    getAllParts: getAllParts,
    getPartById: getPartById,
    updatePart: updatePart,
    deletePart: deletePart,
}