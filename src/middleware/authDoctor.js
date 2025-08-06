import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const authenticateTokenForDoctor = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

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
                message: 'Token không hợp lệ hoặc đã hết hạn'
            });
        }
        if (!user || !user.roleId || user.roleId !== 'R2') {
            return res.status(403).json({
                errCode: 3,
                message: 'Chỉ bác sĩ (R2) mới có quyền truy cập'
            });
        }
        req.user = user;
        next();
    });
};

export default authenticateTokenForDoctor;