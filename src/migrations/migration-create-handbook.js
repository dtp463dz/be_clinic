'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('handbooks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            author: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            descriptionHTML: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            image: {
                type: Sequelize.BLOB('long'),
            },
            publicationDate: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastUpdateDate: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('handbooks');
    }
};