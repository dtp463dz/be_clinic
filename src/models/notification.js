'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Notification.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' });
            Notification.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientData' });
            Notification.belongsTo(models.Booking, { foreignKey: 'bookingId', targetKey: 'id', as: 'bookingData' });
        }
    }
    Notification.init({
        doctorId: DataTypes.INTEGER,
        patientId: DataTypes.INTEGER,
        bookingId: DataTypes.INTEGER,
        message: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Notification',
    });
    return Notification;
};