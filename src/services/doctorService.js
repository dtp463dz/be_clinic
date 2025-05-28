import db from "../models/index";
import dotenv from 'dotenv';
import _ from 'lodash';
dotenv.config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' }, // R2 la doctor
                order: [['createdAt', 'DESC']], // xep theo ngay create
                attributes: {
                    exclude: ['password'] // hide password, image
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

// 
let getAllDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image'] // hide password, image
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })

        } catch (e) {
            reject(e)
        }
    })
}

// luu thong tin doctors
let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter'
                })
            } else {
                // tao case create va edit doctor
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed! '
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// get detail doctor by id service
let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                // Tìm một bản ghi trong bảng User theo id
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password'] // Loại bỏ các trường password và image khỏi kết quả
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'] // lấy các trường được chỉ định
                        }, // Lấy thêm thông tin từ bảng Markdown (quan hệ 1-n hoặc 1-1)
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin position từ bảng Allcode

                    ],
                    raw: true, // Trả về dữ liệu thuần (không phải instance của Sequelize)
                    nest: true, // Giữ cấu trúc lồng nhau giữa các bảng (User -> Markdown)
                })

                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

// bulk create schedule service
// let bulkCreateScheduleService = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: 'Missing required param !'
//                 })
//             } else {
//                 let schedule = data.arrSchedule;
//                 if (schedule && schedule.length > 0) {
//                     schedule = schedule.map((item) => {
//                         item.maxNumber = MAX_NUMBER_SCHEDULE;
//                         item.date = new Date(new Date(item.date).setHours(0, 0, 0, 0)).getTime();
//                         return item;
//                     })
//                 }
//                 console.log('check data bulk create schedule data send: ', schedule);
//                 // check trùng doctorId, date,timeType
//                 let existing = await db.Schedule.findAll(
//                     {
//                         where: { doctorId: data.doctorId, date: data.formattedDate },
//                         attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
//                         raw: true
//                     }
//                 );
//                 // covert date
//                 if (existing && existing.length > 0) {
//                     existing = existing.map(item => {
//                         item.date = new Date(new Date(item.date).setHours(0, 0, 0, 0)).getTime();
//                         return item;
//                     })
//                 }
//                 // differencewith tìm sự khác biệt giữa hai mảng với sự so sánh là timeType, date
//                 // compare different
//                 let toCreate = _.differenceWith(schedule, existing, (a, b) => {
//                     return a.timeType === b.timeType && a.date === b.date;
//                 });

//                 //create data
//                 if (toCreate && toCreate.length > 0) {
//                     await db.Schedule.bulkCreate(toCreate);
//                 }
//                 console.log('check to create: ', toCreate)
//                 resolve({
//                     errCode: 0,
//                     errMessage: 'OK'
//                 })
//             }
//         } catch (e) {
//             reject(e);
//         }
//     })
// }

// bulk create schedule service
const bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            // Kiểm tra đầu vào
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                await t.rollback();
                return resolve({
                    errCode: 1,
                    errMessage: 'Thiếu tham số bắt buộc: arrSchedule, doctorId, hoặc formattedDate'
                });
            }

            if (!Array.isArray(data.arrSchedule) || data.arrSchedule.length === 0) {
                await t.rollback();
                return resolve({
                    errCode: 2,
                    errMessage: 'arrSchedule phải là mảng không rỗng'
                });
            }

            // Chuẩn hóa ngày
            const queryDate = new Date(new Date(Number(data.formattedDate)).setHours(0, 0, 0, 0)).getTime();
            const schedule = data.arrSchedule.map(item => {
                if (!item.timeType || !item.date || item.doctorId !== data.doctorId) {
                    throw new Error('Dữ liệu lịch không hợp lệ: thiếu timeType, date, hoặc doctorId không khớp');
                }
                const itemDate = new Date(new Date(Number(item.date)).setHours(0, 0, 0, 0)).getTime();
                if (itemDate !== queryDate) {
                    throw new Error('Ngày trong arrSchedule không khớp với formattedDate');
                }
                return {
                    ...item,
                    maxNumber: MAX_NUMBER_SCHEDULE,
                    date: itemDate
                };
            });

            // Kiểm tra lịch hiện có
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: queryDate },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true,
                transaction: t
            });

            // Chuẩn hóa ngày của lịch hiện có
            existing = existing.map(item => ({
                ...item,
                date: new Date(new Date(item.date).setHours(0, 0, 0, 0)).getTime()
            }));

            // Lọc lịch không trùng lặp
            const toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
            });

            // Thực hiện bulk create
            let createdCount = 0;
            if (toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate, { transaction: t });
                createdCount = toCreate.length;
            }

            await t.commit();
            resolve({
                errCode: 0,
                errMessage: 'Tạo lịch thành công',
                createdCount
            });
        } catch (e) {
            await t.rollback();
            if (e.name === 'SequelizeUniqueConstraintError') {
                return resolve({
                    errCode: 4,
                    errMessage: 'Lịch khám đã tồn tại trong hệ thống'
                });
            }
            reject(new Error(`Lỗi khi tạo lịch: ${e.message}`));
        }
    });
};

// get schedule doctor by date
const getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter doctorId or date'
                })
            } else {
                // tìm bảng ghi trong bảng Schedule theo doctorId, date
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    raw: false
                })
                if (!dataSchedule) dataSchedule = {}
                resolve({
                    errCode: 0,
                    data: dataSchedule,
                })

            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorService: getAllDoctorService,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleDoctorByDateService: getScheduleDoctorByDateService,
}