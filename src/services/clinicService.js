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
let getAllClinicService = (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            // tính offset
            const offset = (pageNum - 1) * limitNum;
            // lấy dữ liệu với phân trang
            let { count, rows: data } = await db.Clinic.findAndCountAll({
                offset: offset,
                limit: limitNum,
                order: [['id', 'ASC']] // Sắp xếp theo id tăng dần
            })

            if (data && data.length > 0) {
                // console.log('check data: ', data)
                data.map(item => {
                    item.image = new Buffer(item.image, `base64`).toString('binary');
                    return item;
                })
            }
            // Tính tổng số trang
            const totalPages = Math.ceil(count / limitNum);
            resolve({
                errCode: 0,
                errMessage: 'Lấy chuyên khoa thành công',
                data: {
                    clinics: data,
                    currentPage: pageNum,
                    totalPages: totalPages,
                    totalItems: count
                }
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

// Xóa phòng khám
let handleDeleteClinicService = async (clinicId) => {
    try {
        let deletedRows = await db.Clinic.destroy({
            where: { id: clinicId }
        });
        if (deletedRows === 0) {
            return {
                errCode: 2,
                errMessage: 'Phòng khám không tồn tại'
            };
        }
        return {
            errCode: 0,
            errMessage: 'Xóa phòng khám thành công!'
        };
    } catch (e) {
        throw new Error('Lỗi khi xóa phòng khám: ' + e.message);
    }
};

// chỉnh sửa phòng khám
let updateClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 2,
                    errMessage: 'Phòng khám không hợp lệ'
                })
            }
            // update
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false
            })
            if (clinic) {
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.descriptionHTML = data.descriptionHTML;
                clinic.descriptionMarkdown = data.descriptionMarkdown;
                clinic.image = data.image;
                await clinic.save();
                resolve({
                    errCode: 0,
                    message: 'Cập nhật phòng khám thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'Cập nhật phòng khám không thành công'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createClinicService: createClinicService,
    getAllClinicService: getAllClinicService,
    getDetailClinicByIdService: getDetailClinicByIdService,
    handleDeleteClinicService: handleDeleteClinicService,
    updateClinicService: updateClinicService
}