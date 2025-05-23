const { Sequelize } = require('sequelize');

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('be_clinic', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // bỏ dòng chữ Executing (default): SELECT 1+1 AS resul ở terminal
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDB;