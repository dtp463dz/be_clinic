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

module.exports = {
    handleLogin: handleLogin,
}