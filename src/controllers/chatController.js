import chatService from "../services/chatService";

const getMessage = async (req, res) => {
    const fromUserId = req.user.userId; // lấy token đã xác thực
    const toUserId = req.query.to;

    if (!toUserId) {
        return res.status(400).json({
            errCode: 1,
            errMessage: 'Thiếu id người nhận'
        });
    }
    const result = await chatService.getMessageBetweenUsers(fromUserId, toUserId);
    return res.status(200).json(result);
}

const postMessage = async (req, res) => {
    try {
        const fromUserId = req.user.userId; // Lấy từ token JWT
        const { to, content } = req.body;

        const result = await chatService.sendMessage(fromUserId, to, content);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in postMessage:", error);
        return res.status(500).json({
            errCode: -1,
            errMessage: "Lỗi server khi gửi tin nhắn"
        });
    }
}

const getOnlineUsers = async (req, res) => {
    const user = req.user; // đã được verify từ middleware

    const result = chatService.getOnlineUsers(user);
    return res.status(result.errCode === 0 ? 200 : 403).json(result);
}


module.exports = {
    getMessage: getMessage,
    postMessage: postMessage,
    getOnlineUsers: getOnlineUsers,

} 