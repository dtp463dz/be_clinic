import chatHistoryService from "../services/chatHistoryService.js";

const askBot = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const { question, conversationId } = req.body;

        if (!question) {
            return res.status(400).json({ errCode: 1, errMessage: 'Thiếu câu hỏi' });
        }

        const result = await chatHistoryService.saveChat(patientId, question, conversationId);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in askBot:", error);
        return res.status(500).json({ errCode: -1, errMessage: "Lỗi server khi gửi tin nhắn" });
    }
};

const getConversations = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const result = await chatHistoryService.getConversations(patientId);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

const getMessages = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const { conversationId } = req.params;
        const result = await chatHistoryService.getMessagesByConversation(patientId, conversationId);
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errCode: -1, errMessage: 'Lỗi server' });
    }
};

export default { askBot, getConversations, getMessages };
