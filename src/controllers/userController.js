import userService from "../services/userService";

// register
let handleRegister = async (req, res) => {
    let message = await userService.handleRegisterUser(req.body);
    console.log('check message: ', message);
    return res.status(200).json(message);
}

// login
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let delay = parseInt(req.body.delay) || 0;
    // Các bước: 
    // check email người dùng có tồn tại k
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }
    let userData = await userService.handleUserLogin(email, password);

    // trì hoãn phản hồi delay
    setTimeout(() => {
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
        });
    }, delay);
}

// Làm mới access token
let handleRefreshToken = async (req, res) => {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({
            errCode: 1,
            message: 'Missing refresh token'
        });
    }

    let result = await userService.refreshAccessToken(refreshToken);
    return res.status(200).json(result)
}

// Đăng xuất
let handleLogout = async (req, res) => {
    try {
        const userId = req.user.userId; // lấy từ middleware authenticateToken
        const result = await userService.handleLogoutService(userId);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Lỗi từ server'
        });
    }
};

// lay tat ca users
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // all: lấy tất cả người dùng, id: lấy chính xác người dùng
    let page = parseInt(req.query.page) || 1; // Default to page 1
    let limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing requred parameters',
            users: []
        })
    }
    let result = await userService.getAllUsers(id, page, limit);
    // console.log('check users: ', users)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        ...result
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
        // console.log('check data all code: ', data)
        return res.status(200).json(data)

    } catch (e) {
        console.log('Get all code error: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// xem hồ sơ người dùng 
let getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // lấy userId từ JWT token
        let response = await userService.getUserProfileService(userId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        })
    }
}

module.exports = {
    handleRegister: handleRegister,
    handleLogin: handleLogin,
    handleRefreshToken: handleRefreshToken,
    handleLogout: handleLogout,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    getUserProfile: getUserProfile,
}