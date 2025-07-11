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
            from: '"Hệ thống Đặt lịch khám bệnh - Booking Health" <dinhphuc463tp@gmail.com>',  // sender address
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

let sendAttachment = (dataSend) => {
    return new Promise((resolve, reject) => {
        try {
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
                // 
                const attachments = [];
                if (dataSend.image) {
                    attachments.push({
                        filename: `KetQuaDatLich ${dataSend.patientId} - ${new Date().getTime()}.PNG`,
                        content: dataSend.image.split('base64,')[1],
                        encoding: 'base64'
                    });
                }

                if (dataSend.pdfBase64) {
                    attachments.push({
                        filename: `PhieuKham_${dataSend.patientId}_${Date.now()}.pdf`,
                        content: dataSend.pdfBase64.split('base64,')[1],
                        encoding: 'base64'
                    });
                }
                const info = await transporter.sendMail({
                    from: '"Hệ thống Đặt lịch khám bệnh - Booking Health" <dinhphuc463tp@gmail.com>',  // sender address
                    to: dataSend.email,          // list of receivers
                    subject: "🔔 Kết quả đặt lịch khám bệnh - Booking Health", // subject line
                    html: `
                        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                            <h2 style="color: #2a9d8f;">Xin chào ${dataSend.patientName},</h2>
                            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên hệ thống <strong>Booking Health</strong> thành công.</p>
                            <h3>📋 Thông tin hóa đơn được gửi trong file đính kèm:</h3>
                            <p style="margin-top: 30px;">Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
                            <hr/>
                            <p style="font-size: 14px; color: #888;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                        </div>
                        `, // HTML body
                    attachments: attachments.length > 0 ? attachments : undefined
                });
                console.log("Attachment Email sent:", info.messageId);
                resolve(info);
            })();
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}