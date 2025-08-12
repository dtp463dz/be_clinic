import db from '../models/index.js';
import fetch from 'node-fetch';
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

const saveChat = async (patientId, question, conversationId) => {
    const answer = await callGeminiAPI(question);

    let convId = conversationId;

    if (!convId) {
        const newConv = await db.Conversation.create({
            patientId,
            title: question.slice(0, 50) // cắt 50 ký tự đầu làm tiêu đề
        });
        convId = newConv.id;
    }

    const chat = await db.ChatHistory.create({
        patientId,
        conversationId: convId,
        question,
        answer,
        timestamp: new Date()
    });

    return { errCode: 0, data: chat, answer, conversationId: convId };
};

const getConversations = async (patientId) => {
    const conversations = await db.Conversation.findAll({
        where: { patientId },
        order: [['createdAt', 'DESC']]
    });
    return { errCode: 0, data: conversations };
};

const getMessagesByConversation = async (patientId, conversationId) => {
    const messages = await db.ChatHistory.findAll({
        where: { patientId, conversationId },
        order: [['timestamp', 'ASC']]
    });
    return { errCode: 0, data: messages };
};

export default { saveChat, getConversations, getMessagesByConversation };
