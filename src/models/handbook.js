'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HandBook extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    HandBook.init({
        author: DataTypes.STRING,
        title: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        image: DataTypes.STRING,
        publicationDate: DataTypes.DATE,
        lastUpdateDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'HandBook',
    });
    return HandBook;
};