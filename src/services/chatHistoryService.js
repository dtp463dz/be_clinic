import db from '../models/index.js';
import fetch from 'node-fetch'; // gọi Gemini API
import dotenv from 'dotenv';
dotenv.config();

const callGeminiAPI = async (question) => {
    try {
        const response = await fetch(process.env.GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: question }] }]
            })
        });
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xin lỗi, tôi chưa có câu trả lời.';
    } catch (err) {
        console.error('Gemini API error:', err);
        return 'Xin lỗi, có lỗi khi xử lý yêu cầu.';
    }
};

const saveChat = async (patientId, question) => {
    // Gọi Gemini API lấy câu trả lời
    const answer = await callGeminiAPI(question);

    // Lưu vào DB
    const chat = await db.ChatHistory.create({
        patientId,
        question,
        answer,
        timestamp: new Date()
    });

    return { errCode: 0, data: chat, answer };
};

const getHistory = async (patientId) => {
    const chats = await db.ChatHistory.findAll({
        where: { patientId },
        order: [['timestamp', 'ASC']]
    });
    return { errCode: 0, data: chats };
};

export default { saveChat, getHistory };
