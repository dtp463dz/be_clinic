import db from "../models/index";

let createClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    image: data.image
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Tạo phòng khám thành công'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

// lấy all phòng khám
let getAllClicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

            });
            if (data && data.length > 0) {
                // console.log('check data: ', data)
                data.map(item => {
                    item.image = new Buffer(item.image, `base64`).toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Lấy chuyên khoa thành công',
                data
            })

        } catch (e) {
            reject(e)
        }

    })
}

// chi tiet chuyen khoa
let getDetailClinicByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],

                })
                if (data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                    })
                    data.doctorClinic = doctorClinic;
                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Lấy chuyên khoa thành công',
                    data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createClinicService: createClinicService,
    getAllClicService: getAllClicService,
    getDetailClinicByIdService: getDetailClinicByIdService
}