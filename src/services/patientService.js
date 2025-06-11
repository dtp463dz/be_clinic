import db from "../models/index";
import dotenv from 'dotenv';
import emailService from "./emailService";

let postBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,   // email nhận
                    patientName: data.fullName, // ten benh nhan
                    time: data.timeString,      // thời gian đặt lịch
                    doctorName: data.doctorName,      // tên bác sĩ 
                    redirectLink: 'http://localhost:5173/home',
                })
                // upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
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


module.exports = {
    postBookAppointmentService: postBookAppointmentService
}