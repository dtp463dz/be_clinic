import db from "../models/index";
import { Sequelize } from "../models/index";
import { getOnlineUserList } from "../utils/onlineUsers";

const getMessageBetweenUsers = async (fromUserId, toUserId) => {
    try {
        const messages = await db.Message.findAll({
            where: {
                [Sequelize.Op.or]: [
                    { senderId: fromUserId, receiverId: toUserId },
                    { senderId: toUserId, receiverId: fromUserId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });

        return {
            errCode: 0,
            data: messages
        };
    } catch (error) {
        console.error("getMessagesBetweenUsers error:", error);
        return {
            errCode: -1,
            errMessage: "Lỗi server khi lấy tin nhắn"
        };
    }
}

const sendMessage = async (from, to, content) => {
    try {
        // Kiểm tra thiếu trường nào
        const missingFields = [];
        if (!from) missingFields.push("from");
        if (!to) missingFields.push("to");
        if (!content) missingFields.push("content");

        if (missingFields.length > 0) {
            return {
                errCode: 1,
                errMessage: `Thiếu trường: ${missingFields.join(', ')}`,
                form: {
                    from: !!from,
                    to: !!to,
                    content: !!content
                }
            };
        }
        const message = await db.Message.create({
            senderId: from,
            receiverId: to,
            content: content
        });
        return {
            errCode: 0,
            errMessage: "Gửi tin nhắn thành công",
            data: message
        };
    } catch (error) {
        console.error(" sendMessage error:", error);
        return {
            errCode: -1,
            errMessage: "Lỗi server khi gửi tin nhắn"
        };
    }
};

const getOnlineUsers = (user) => {
    if (user.roleId !== 'R1') {
        return {
            errCode: 1,
            errMessage: 'Chỉ admin (R1) mới có quyền xem người online'
        };
    }

    const onlineUsers = getOnlineUserList(); // trả về mảng userId
    return {
        errCode: 0,
        onlineUsers: onlineUsers
    };
};



module.exports = {
    getMessageBetweenUsers,
    sendMessage,
    getOnlineUsers
}
