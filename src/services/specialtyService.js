import db from "../models/index";

// tạo mới chuyên khoa
let createSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Tạo chuyên khoa thành công'
                })
            }


        } catch (e) {
            reject(e);
        }
    })
}

// lay all chuyên khoa
let getAllSpecialtyService = (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Chuyển đổi page và limit thành số nguyên
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            // Tính offset
            const offset = (pageNum - 1) * limitNum;
            // lấy dữ liệu với phân trang
            let { count, rows: data } = await db.Specialty.findAndCountAll({
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
                    specialties: data,
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
let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],

                })
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Infor.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
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

// xóa chuyên khoa
let handleDeleteSpecialtyService = async (specialtyId) => {
    try {
        let deletedRows = await db.Specialty.destroy({
            where: { id: specialtyId }
        });
        if (deletedRows === 0) {
            return {
                errCode: 2,
                errMessage: 'Chuyên khoa không tồn tại'
            };
        }
        return {
            errCode: 0,
            errMessage: 'Xóa chuyên khoa thành công!'
        };
    } catch (e) {
        throw new Error('Lỗi khi xóa chuyên khoa: ' + e.message);
    }
}

// edit chuyen khoa
let updateSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown || !data.image) {
                resolve({
                    errCode: 2,
                    errMessage: 'Chuyên khoa không hợp lệ'
                })
            }
            // update
            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
                raw: false
            })
            if (specialty) {
                specialty.name = data.name;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                specialty.image = data.image;
                await specialty.save();
                resolve({
                    errCode: 0,
                    message: 'Cập nhật chuyên khoa thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'Cập nhật chuyên khoa không thành công'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSpecialtyService: createSpecialtyService,
    getAllSpecialtyService: getAllSpecialtyService,
    getDetailSpecialtyByIdService: getDetailSpecialtyByIdService,
    handleDeleteSpecialtyService: handleDeleteSpecialtyService,
    updateSpecialtyService: updateSpecialtyService,

}