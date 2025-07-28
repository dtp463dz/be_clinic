import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const isAdmin = (req, res, next) => {
    if (req.user?.roleId !== 'R1') {
        return res.status(403).json({
            errCode: 1,
            message: 'Chỉ admin mới có quyền truy cập'
        });
    }
    next();
};

module.exports = isAdmin;