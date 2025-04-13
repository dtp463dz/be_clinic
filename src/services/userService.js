import db from "../models/index";
import bcrypt from "bcryptjs"; // hash password

//login
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            // check có tồn tại hay không
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist
                let user = await db.User.findOne({
                    // lọc, chỉ muốn lấy giá trị nhất định
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true, // trả ra biến obj

                }); // check tren db
                if (user) {
                    // compare (so sanh) password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        // thanh cong
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password; // xóa password ko cho hien thi ở api
                        userData.user = user; // ket qua 
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User isn't not found`;
                }
            } else {
                // return error
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Plz try other email`
            }
            resolve(userData)

        } catch (e) {
            reject(e)
        }
    })
}
// check user email login
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            // tìm user ở model có table User
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            // check user 
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e);
        }
    })
}

// lay tat ca users
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            // check
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password'] // hide password
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password'] // hide password
                    }
                })
            }
            resolve(users)
        } catch (e) {
            reject(e);
        }
    })

}



module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
}