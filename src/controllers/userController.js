import userService from "../services/userService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    console.log('your email: ', + email);
    let password = req.body.password;
    // Các bước: 
    // check email người dùng có tồn tại k
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    console.log('check userData: ', userData)
    // so sánh password của người dùng truyền lên cho chúng ta
    // return userInfor
    // access token: JWT json web token


    return res.status(200).json({
        // errCode: 0,
        // message: 'hello world',
        // yourEmail: email,
        // test: 'test'
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

// lay tat ca users
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // all: lấy tất cả người dùng, id: lấy chính xác người dùng
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requred parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);
    // console.log('check users: ', users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

// tạo mới user
let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    // console.log('check message handleCreateNewUser: ', message);
    return res.status(200).json(message);
}

// edit user
let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)

}

// delete user
let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!'
        })
    }
    let message = await userService.deleteUser(req.body.id);
    // console.log('check message handleCreateNewUser: ', message);
    return res.status(200).json(message);
}

// get all code
let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        console.log('check data all code: ', data)
        return res.status(200).json(data)

    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
}