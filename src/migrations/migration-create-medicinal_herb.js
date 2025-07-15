'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('medicinal_herbs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            descriptionHTML: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            descriptionMarkdown: {
                allowNull: false,
                type: Sequelize.TEXT('long')
            },
            image: {
                type: Sequelize.BLOB('long'),
                allowNull: true
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
        await queryInterface.dropTable('medicinal_herbs');
    }
};