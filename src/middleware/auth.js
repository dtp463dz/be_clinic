import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            errCode: 1,
            message: 'Không tìm thấy token xác thực'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                errCode: 2,
                message: `Token không hợp lệ hoặc đã hết hạn`
            });
        }
        if (!user || !user.roleId) {
            return res.status(403).json({
                errCode: 3,
                message: 'Thông tin người dùng không hợp lệ'
            });
        }
        // Kiểm tra roleId
        if (user.roleId !== 'R2' && user.roleId !== 'R3') {
            return res.status(403).json({
                errCode: 3,
                errMessage: 'Chỉ bệnh nhận (R3) mới có quyền truy cập'
            })
        }

        req.user = user;
        next();
    });

};

export default authenticateToken;