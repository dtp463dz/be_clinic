'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Symptom extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Symptom.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        image: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Symptom',
    });
    return Symptom;
};