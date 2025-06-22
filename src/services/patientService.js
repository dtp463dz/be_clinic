import db from "../models/index";
import dotenv from 'dotenv';
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid';

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
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,   // email nhận
                    patientName: data.fullName, // ten benh nhan
                    time: data.timeString,      // thời gian đặt lịch
                    doctorName: data.doctorName,      // tên bác sĩ 
                    redirectLink: buildUrlEmail(data.doctorId, token),
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender, // giới tính
                        address: data.address,              // địa chỉ
                        firstName: data.fullName, // tên bệnh nhân
                    },
                });
                console.log('check user db:', user[0])

                // create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'save infor patient succeed'
                })
            }
        } catch (e) {
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


module.exports = {
    postBookAppointmentService: postBookAppointmentService,
    postVerifyBookAppointment: postVerifyBookAppointment,
}