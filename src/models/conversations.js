'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Conversation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Conversation.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
            Conversation.hasMany(models.ChatHistory, { foreignKey: 'conversationId', as: 'messages' });
        }
    }
    Conversation.init({
        patientId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Conversation',
        tableName: 'conversations',
        timestamps: false
    });
    return Conversation;
};