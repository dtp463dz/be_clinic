import medicinalHerbService from "../services/medicinalHerbService.js";

let createHerb = async (req, res) => {
    try {
        const response = await medicinalHerbService.createHerbService(req.body);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch {
        res.status(500).json({ errCode: -1, errMessage: "Lỗi server nội bộ" });
    }
}

let getAllHerbs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const response = await medicinalHerbService.getAllHerbsService(page, limit);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch {
        console.error("Lỗi controller getAllHerbs: ", e);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi lấy dược liệu",
        });
    }
}

let getHerbById = async (req, res) => {
    try {
        const response = await medicinalHerbService.getHerbByIdService(req.query.id);
        res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let updateHerb = async (req, res) => {
    try {
        const response = await medicinalHerbService.updateHerbService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller updateHerb:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}

let deleteHerb = async (req, res) => {
    try {
        const id = req.body.id;
        const response = await medicinalHerbService.deleteHerbService(id);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (error) {
        console.error("Lỗi controller deleteHerb:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server nội bộ"
        });
    }
}
module.exports = {
    createHerb: createHerb,
    getAllHerbs: getAllHerbs,
    getHerbById: getHerbById,
    updateHerb: updateHerb,
    deleteHerb: deleteHerb,
}