import db from "../models/index";
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
            if (!inputData.doctorId || inputData.contentHTML || inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter'
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                })
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

module.exports = {
    getTopDoctorHomeService: getTopDoctorHomeService,
    getAllDoctorService: getAllDoctorService,
    saveDetailInforDoctor: saveDetailInforDoctor,
}