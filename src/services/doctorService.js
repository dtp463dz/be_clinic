import db from "../models/index";
import dotenv from 'dotenv';
import _, { reject } from 'lodash';
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
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.action ||
                !inputData.priceId ||
                !inputData.paymentId ||
                !inputData.provinceId ||
                !inputData.nameClinic ||
                !inputData.addressClinic ||
                !inputData.note
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter'
                })
            } else {
                // tao case create va edit doctor Markdown
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
                // upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorInfor) {
                    //update Cập nhật bản ghi
                    doctorInfor.priceId = inputData.priceId;
                    doctorInfor.paymentId = inputData.paymentId;
                    doctorInfor.provinceId = inputData.provinceId;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;
                    await doctorInfor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.priceId,
                        paymentId: inputData.paymentId,
                        provinceId: inputData.provinceId,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor succeed! '
                })
            }
        } catch (e) {
            console.error('Lỗi khi lưu thông tin bác sĩ:', e);
            resolve({
                errCode: 2,
                errMessage: 'Lỗi server khi lưu thông tin bác sĩ',
            });
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
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId'] // ngoại trừ các trường được chỉ định
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap price từ bảng Allcode
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap province từ bảng Allcode
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap payment từ bảng Allcode
                            ]
                        },

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

// bulk create schedule service theo vid
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

            // Chuẩn hóa ngày thành chuỗi timestamp
            const formatDate = (timestamp) => {
                const date = new Date(Number(timestamp));
                return Math.floor(date.setHours(0, 0, 0, 0)).toString(); // Chuỗi timestamp (ví dụ: "1748451600000")
            };

            const queryDate = formatDate(data.formattedDate);
            const schedule = data.arrSchedule.map(item => {
                if (!item.timeType || !item.date || item.doctorId !== data.doctorId) {
                    throw new Error('Dữ liệu lịch không hợp lệ: thiếu timeType, date, hoặc doctorId không khớp');
                }
                const itemDate = formatDate(item.date);
                if (itemDate !== queryDate) {
                    throw new Error('Ngày trong arrSchedule không khớp với formattedDate');
                }
                return {
                    ...item,
                    maxNumber: MAX_NUMBER_SCHEDULE,
                    date: itemDate // Lưu dưới dạng chuỗi timestamp
                };
            });
            console.log('check data bulk create schedule data send: ', schedule);

            // Kiểm tra lịch hiện có
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: queryDate },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true,
                transaction: t
            });

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
                    // thêm data ở Allcode vào bảng Schedule thông qua association
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy timeTypeData được định nghĩa bên bảng Allcode và Schedule
                    ],
                    nest: true, // Giữ cấu trúc lồng nhau giữa các bảng (Schedule -> Allcode)
                    raw: false // Trả về dữ liệu thuần (không phải instance của Sequelize)
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

// get extra infor doctor by id
const getExtraInforDoctorByIdService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter doctorId'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput
                    },
                    attributes: {
                        exclude: ['id', 'doctorId'] // ngoại trừ các trường được chỉ định
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap price từ bảng Allcode
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap province từ bảng Allcode
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }, // lấy thông tin keyMap payment từ bảng Allcode
                    ],
                    raw: true, // Trả về dữ liệu thuần (không phải instance của Sequelize)
                    nest: true, // Giữ cấu trúc lồng nhau giữa các bảng (Doctor_Infor -> Allcode)
                })
                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            console.log(e)
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
    getExtraInforDoctorByIdService: getExtraInforDoctorByIdService,
}