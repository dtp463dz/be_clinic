import bcrypt from "bcryptjs"; // hash password
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

// create new user
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false, // dieu kien gender
                roleId: data.roleId,
            })
            resolve('ok create a new user succed! ');
        } catch (e) {
            reject(e)
        }
    })

}

// hash password
let hashUserPassword = (password) => {
    // Promise đảm bảo hàm này luôn trả kết quả cho chúng ta
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

// read user
let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            // findAll :  sequelize find 
            let users = db.User.findAll({
                raw: true // show only array
            });
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

// view find update user
let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // findOne: sequelize find 
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resolve(user);
            } else {
                resolve({})
            }
        } catch (e) {
            reject(e);
        }
    })
}

// update user data form
let updateUserData = (data) => {
    // console.log('data from service')
    // console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            // sequelize update
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                // update fname, lname, address 
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                // luu thong tin cua user lai
                await user.save();
                // lay lai all user
                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        } catch (e) {
            console.log(e)
        }
    })
}

// delete user
let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // delete requelize
            let user = await db.User.findOne({
                where: { id: userId },
            })
            if (user) {
                await user.destroy();
            }
            resolve(); // return()
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}