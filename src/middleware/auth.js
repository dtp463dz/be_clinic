import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"

    if (!token) {
        return res.status(401).json({
            errCode: 1,
            message: 'Access token is required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                errCode: 2,
                message: `Invalid or expired access`
            });
        }

        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };