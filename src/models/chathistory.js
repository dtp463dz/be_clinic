'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ChatHistory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            ChatHistory.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
        }
    }
    ChatHistory.init({
        patientId: DataTypes.INTEGER,
        question: DataTypes.TEXT,
        answer: DataTypes.TEXT,
        timestamp: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'ChatHistory',
        tableName: 'chat_histories',
        timestamps: false
    });
    return ChatHistory;
};