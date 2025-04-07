import bcrypt from "bcryptjs"; // hash password
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resole, reject) => {
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
            resole('ok create a new user succed! ');
        } catch (e) {
            reject(e)
        }
    })

}

let hashUserPassword = (password) => {
    // Promise đảm bảo hàm này luôn trả kết quả cho chúng ta
    return new Promise(async (resole, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resole(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    hashUserPassword: hashUserPassword,
}