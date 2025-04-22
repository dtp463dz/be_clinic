import { raw } from "body-parser";
import db from "../models/index";
import bcrypt from "bcryptjs"; // hash password

const salt = bcrypt.genSaltSync(10);
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

// tạo mới user
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email có tồn tại không
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    message: 'Email này đã được sử dụng. Vui lòng tạo email khác'
                })
            }
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
            })
            resolve({
                errCode: 0,
                message: 'OK'
            })
        } catch (e) {
            reject(e);
        }
    })
}

// edit user
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Người dùng không hợp lệ'
                })
            }
            // sequelize update
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            // console.log('check user edit', user)
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                // luu thong tin cua user lai
                // await db.user.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // }, {where: {id: userId}})
                resolve({
                    errCode: 0,
                    message: 'Cập nhật người dùng thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'Cập nhật người dùng không thành công'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

// delete user
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            // delete requelize
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'Người dùng này không tồn tại'
                })
            }
            console.log('check: ', user)
            await user.destroy({
                where: { id: userId }
            });// phá hủy người dùng


            resolve({
                errCode: 0,
                errMessage: 'Thực hiện xóa người dùng thành công!'
            });
        } catch (e) {
            reject(e);
        }
    })

}

// all code
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !',
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput } // tìm type trong bảng
                });
                res.errCode = 0;
                res.data = allcode
                resolve(res);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}