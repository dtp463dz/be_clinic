const crypto = require('crypto');

// Tạo khóa bí mật ngẫu nhiên
const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

console.log('JWT_SECRET:', generateSecret());
console.log('REFRESH_TOKEN_SECRET:', generateSecret());