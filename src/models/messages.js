'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Message extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Message.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
            Message.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiverId' });
        }
    }
    Message.init({
        senderId: DataTypes.INTEGER,
        receiverId: DataTypes.INTEGER,
        content: DataTypes.TEXT,
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        sequelize,
        modelName: 'Message',
    });
    return Message;
};