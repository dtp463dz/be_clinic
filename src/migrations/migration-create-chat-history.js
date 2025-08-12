'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('chat_histories', {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            patientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            question: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            answer: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            timestamp: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },

        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('chat_histories');
    }
};