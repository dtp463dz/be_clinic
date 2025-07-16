import drugService from "../services/drugService.js";

let createDrug = async (req, res) => {
    try {
        const response = await drugService.createDrugService(req.body);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        console.error("Lỗi controller createDrug: ", e);
        res.status(500).json({ errCode: -1, errMessage: "Lỗi server nội bộ" });
    }
}

let getAllDrug = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await drugService.getAllDrugService(page, limit);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        console.error("Lỗi controller getAllDrug: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ",
        });
    }
}

let getDrugById = async (req, res) => {
    try {
        const response = await drugService.getDrugByIdService(req.query.id);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller getDrugById:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let updateDrug = async (req, res) => {
    try {
        const response = await drugService.updateDrugService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller updateDrug:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let deleteDrug = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await drugService.deleteDrugService(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller deleteDrug:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

module.exports = {
    createDrug: createDrug,
    getAllDrug: getAllDrug,
    getDrugById: getDrugById,
    updateDrug: updateDrug,
    deleteDrug: deleteDrug,
}