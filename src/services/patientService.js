import db from "../models/index";
import dotenv from 'dotenv';
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName || !data.selectedGender || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                });
                return;
            }

            let user = null;
            if (data.patientId) {
                // Trường hợp người dùng đã đăng nhập
                user = await db.User.findOne({
                    where: { id: data.patientId, roleId: 'R3', email: data.email },
                    attributes: ['id', 'email', 'firstName', 'gender', 'address'],
                    raw: true
                });
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'User not found or not a patient'
                    });
                    return;
                }
            } else {
                // Trường hợp không đăng nhập, tự động tạo user
                let userData = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                    },
                });
                user = userData[0];
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không thể tạo hoặc tìm bệnh nhân'
                    });
                    return;
                }
            }

            let token = uuidv4();
            await emailService.sendSimpleEmail({
                reciverEmail: data.email,
                patientName: data.fullName,
                time: data.timeString,
                doctorName: data.doctorName,
                redirectLink: buildUrlEmail(data.doctorId, token),
            });

            // Tạo lịch hẹn
            let booking = await db.Booking.findOrCreate({
                where: { patientId: user.id, date: data.date, timeType: data.timeType },
                defaults: {
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: user.id,
                    date: data.date,
                    timeType: data.timeType,
                    token: token
                }
            });

            if (!booking || !booking[0]) {
                resolve({
                    errCode: 3,
                    errMessage: 'Không thể tạo hoặc tìm bệnh nhân'
                });
                return;
            }

            // Lấy thông tin bác sĩ để gửi email thông báo
            const doctor = await db.User.findOne({
                where: { id: data.doctorId, roleId: 'R2' },
                attributes: ['email', 'firstName', 'lastName'],
                raw: true
            });

            // Gửi email thông báo cho bác sĩ
            if (doctor) {
                await emailService.sendDoctorNotificationEmail({
                    reciverEmail: doctor.email,
                    doctorName: `${doctor.firstName} ${doctor.lastName}`,
                    patientName: data.fullName,
                    time: data.timeString,
                    date: data.date,
                    redirectLink: `${process.env.URL_REACT}/doctor/schedule`,
                    subject: '🔔 Lịch hẹn mới từ bệnh nhân - Booking Health'
                });
            }

            // Lưu thông báo vào bảng notifications
            await db.Notification.create({
                doctorId: data.doctorId,
                patientId: user.id,
                bookingId: booking[0].id,
                message: `Bệnh nhân ${data.fullName} đã đặt lịch khám vào ${data.timeString}, ngày ${data.date}`,
                status: 'unread'
            });

            resolve({
                errCode: 0,
                errMessage: 'Đặt lịch khám thành công'
            });
        } catch (e) {
            console.log('Error in postBookAppointmentService:', e);
            reject(e);
        }
    })
}

// verify xac nhan lich kham
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                // check lich hen
                if (appointment) {
                    appointment.statusId = 'S2' // neu thanh cong thi chuyen sang s2
                    await appointment.save() // luu vao db
                    resolve({
                        errCode: 0,
                        errMessage: "Cập nhật lịch hẹn thành công"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Lịch hẹn đã được kích hoạt hoặc không tồn tại"
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

// huy lich kham
let cancelAppointmentService = (bookingId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId || !userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc'
                });
                return;
            }
            let appointment = await db.Booking.findOne({
                where: {
                    id: bookingId,
                    patientId: userId,
                    statusId: { [db.Sequelize.Op.in]: ['S1', 'S2'] } // Chỉ cho phép hủy lịch hẹn đang chờ hoặc đã xác nhận
                },
                raw: false
            });
            if (!appointment) {
                resolve({
                    errCode: 2,
                    errMessage: 'Không tìm thấy lịch hẹn hoặc bạn không có quyền hủy'
                });
                return;
            }
            appointment.statusId = 'S4'; // Cập nhật trạng thái thành Đã hủy
            await appointment.save();

            // Lấy thông tin người dùng và lịch hẹn để gửi email
            const user = await db.User.findOne({
                where: { id: userId },
                attributes: ['email', 'firstName', 'lastName'],
                raw: true
            });
            const timeType = await db.Allcode.findOne({
                where: { keyMap: appointment.timeType },
                attributes: ['valueVi'],
                raw: true
            });
            const doctor = await db.User.findOne({
                where: { id: appointment.doctorId },
                attributes: ['firstName', 'lastName'],
                raw: true
            });
            // Định dạng ngày từ timestamp sang DD/MM/YYYY
            // Thay đoạn định dạng ngày trong cancelAppointmentService
            const dateObj = new Date(Number(appointment.date));
            const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

            await emailService.sendCancelAppointmentEmail({
                reciverEmail: user.email,
                patientName: `${user.firstName} ${user.lastName}`,
                time: timeType ? timeType.valueVi : 'N/A',
                date: formattedDate,
                doctorName: doctor ? `${doctor.firstName} ${doctor.lastName}` : 'N/A',
                redirectLink: `${process.env.URL_REACT}/book-appointment`
            });
            resolve({
                errCode: 0,
                errMessage: 'Hủy lịch hẹn thành công'
            });
        } catch (e) {
            console.log('Lỗi khi hủy lịch hẹn cancelAppointmentService: ', e);
            reject(e);
        }
    })
}


module.exports = {
    postBookAppointmentService: postBookAppointmentService,
    postVerifyBookAppointment: postVerifyBookAppointment,
    cancelAppointmentService: cancelAppointmentService,
}