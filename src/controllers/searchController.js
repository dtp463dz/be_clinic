import searchService from "../services/searchService.js";

let search = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;
        let response = await searchService.searchService(keyword, page, limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        });
    }
}

let searchMedical = async (req, res) => {
    try {
        const { keyword = '', page = 1, limit = 10 } = req.query;
        let response = await searchService.searchMedicalService(keyword, page, limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        });
    }
}
module.exports = {
    search, searchMedical
};