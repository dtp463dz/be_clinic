import handbookService from "../services/handbookService.js";

let createHandBook = async (req, res) => {
    try {
        let response = await handbookService.createHandBookService(req.body);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })

    }
}

let getAllHandBook = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        let response = await handbookService.getAllHandBookService(page, limit);
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server... ' + e.message
        })
    }
}

let getDetailHandBookById = async (req, res) => {
    try {
        let response = await handbookService.getDetailHandBookByIdService(req.query.id)
        return res.status(response.errCode === 0 ? 200 : 400).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server...' + e.message
        })
    }
}

let handleEditHandBook = async (req, res) => {
    try {
        let response = await handbookService.updateHandBookService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server ' + e.message
        })
    }
}

let handleDeleteHandBook = async (req, res) => {
    const handbookId = req.body.id;
    if (!handbookId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Thiếu tham số id cẩm nang'
        });
    }
    try {
        let message = await handbookService.handleDeleteHandBookService(handbookId);
        return res.status(message.errCode === 0 ? 200 : 404).json(message);
    } catch (e) {
        return res.status(500).json({
            errCode: 3,
            errMessage: 'Lỗi server khi xóa cẩm nang'
        })
    }
}

module.exports = {
    createHandBook: createHandBook,
    getAllHandBook: getAllHandBook,
    getDetailHandBookById: getDetailHandBookById,
    handleEditHandBook: handleEditHandBook,
    handleDeleteHandBook: handleDeleteHandBook,


} 