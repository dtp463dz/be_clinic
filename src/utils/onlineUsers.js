const onlineUsers = new Map(); // userId => socketId

const addUser = (userId, socketId) => {
    onlineUsers.set(userId, socketId);
};

const removeUserBySocket = (socketId) => {
    for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socketId) {
            onlineUsers.delete(uid);
            break;
        }
    }
};

const getSocketByUserId = (userId) => {
    return onlineUsers.get(userId);
};

const getOnlineUserList = () => {
    return Array.from(onlineUsers.keys());
};

module.exports = {
    addUser,
    removeUserBySocket,
    getSocketByUserId,
    getOnlineUserList
};
