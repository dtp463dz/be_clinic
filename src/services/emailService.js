import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

let sendSimpleEmail = (datasend) => {

    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Wrap in an async IIFE so we can use await.
    (async () => {
        const info = await transporter.sendMail({
            from: '"DevPhuxz" <dinhphuc463tp@gmail.com>',  // sender address
            to: datasend.reciverEmail,          // list of receivers
            subject: "🔔 Xác nhận lịch khám bệnh - Booking Health", // subject line
            html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                <h2 style="color: #2a9d8f;">Xin chào ${datasend.patientName},</h2>
                <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống <strong>Booking Health</strong>.</p>
                <h3>📋 Thông tin đặt lịch:</h3>
                <ul>
                    <li><strong>⏰ Thời gian:</strong> ${datasend.time}</li>
                    <li><strong>👨‍⚕️ Bác sĩ:</strong> ${datasend.doctorName}</li>
                </ul>
                <p>Vui lòng xác nhận để hoàn tất quá trình đặt lịch:</p>
                <div style="margin: 20px 0;">
                    <a href="${datasend.redirectLink}" 
                    style="padding: 10px 20px; background-color: #2a9d8f; color: white; text-decoration: none; border-radius: 5px;">
                        ✅ Xác nhận lịch khám
                    </a>
                </div>
                <p style="margin-top: 30px;">Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                <hr/>
                <p style="font-size: 14px; color: #888;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            </div>
            `, // HTML body
        });

        console.log("Message sent:", info.messageId);
    })();

}



module.exports = {
    sendSimpleEmail: sendSimpleEmail
}