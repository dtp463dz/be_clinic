import chatHistoryService from "../services/chatHistoryService.js";

const askBot = async (req, res) => {
    try {
        const patientId = req.user.userId; // lấy token đã xác thực
        const { question } = req.body;

        if (!patientId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Thiếu câu hỏi'
            });
        }
        const result = await chatHistoryService.saveChat(patientId, question);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in askBot:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi gửi tin nhắn"
        });
    }
}

const getHistory = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const result = await chatHistoryService.getHistory(patientId);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
}

module.exports = {
    askBot: askBot,
    getHistory: getHistory,
} 