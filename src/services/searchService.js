import db from "../models/index";
import { Op, where } from "sequelize";

let searchService = async (keyword, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;
            const keywordLower = keyword.toLowerCase().trim();

            if (!keywordLower) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Vui lòng cung cấp từ khóa tìm kiếm',
                    data: {
                        doctors: [],
                        clinics: [],
                        specialties: [],
                        handbooks: [],
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: pageNum,
                        limit: limitNum
                    }
                });
            }

            // Tìm kiếm bác sĩ (Users với roleId = 'R2')
            const doctorQuery = {
                where: {
                    roleId: 'R2',
                    [Op.or]: [
                        { firstName: { [Op.like]: `%${keywordLower}%` } },
                        { lastName: { [Op.like]: `%${keywordLower}%` } },
                        { email: { [Op.like]: `%${keywordLower}%` } }
                    ]
                },
                attributes: {
                    exclude: ['password', 'image']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            };

            // Tìm kiếm phòng khám
            const clinicQuery = {
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keywordLower}%` } },
                        { address: { [Op.like]: `%${keywordLower}%` } }
                    ]
                },
                attributes: ['id', 'name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            };

            // Tìm kiếm chuyên khoa
            const specialtyQuery = {
                where: {
                    name: { [Op.like]: `%${keywordLower}%` }
                },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            };

            // Tìm kiếm cẩm nang
            const handbookQuery = {
                where: {
                    title: { [Op.like]: `%${keywordLower}%` }
                },
                attributes: ['id', 'author', 'title', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            };
            // Thực hiện truy vấn song song
            const [doctorsResult, clinicsResult, specialtiesResult, handbookResult] = await Promise.all([
                db.User.findAndCountAll({
                    ...doctorQuery,
                    offset,
                    limit: limitNum
                }),
                db.Clinic.findAndCountAll({
                    ...clinicQuery,
                    offset,
                    limit: limitNum
                }),
                db.Specialty.findAndCountAll({
                    ...specialtyQuery,
                    offset,
                    limit: limitNum
                }),
                db.HandBook.findAndCountAll({
                    ...handbookQuery,
                    offset,
                    limit: limitNum
                })

            ]);

            // Xử lý hình ảnh cho phòng khám và chuyên khoa, cẩm nang
            const clinics = clinicsResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            });

            const specialties = specialtiesResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            });

            const handbooks = handbookResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            })

            // Tổng số kết quả
            const totalItems = doctorsResult.count + clinicsResult.count + specialtiesResult.count + handbooks.count;
            const totalPages = Math.ceil(totalItems / limitNum);

            resolve({
                errCode: 0,
                errMessage: 'Tìm kiếm thành công',
                data: {
                    doctors: doctorsResult.rows,
                    clinics,
                    specialties,
                    handbooks,
                    totalItems,
                    totalPages,
                    currentPage: pageNum,
                    limit: limitNum
                }
            });
        } catch (e) {
            reject(e);
        }
    });
};

let searchMedicalService = async (keyword, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (page - 1) * limitNum;
            const keywordLower = keyword.toLowerCase().trim();

            if (!keywordLower) {
                return resolve({
                    errCode: 1,
                    errMessage: 'Vui lòng cung cấp từ khóa tìm kiếm',
                    data: {
                        symptoms: [],
                        drugs: [],
                        herbs: [],
                        bodyParts: [],
                        totalItems: 0,
                        totalPages: 0,
                        currentPage: pageNum,
                        limit: limitNum
                    }
                });
            }

            // tìm kiếm triệu chứng 
            const symptomQuery = {
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keywordLower}%` } },
                        { descriptionHTML: { [Op.like]: `%${keywordLower}%` } }
                    ]
                },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            }

            // tìm kiếm thuốc
            const drugQuery = {
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keywordLower}%` } },
                    ]
                },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            }

            // tìm kiếm dược liệu
            const herbQuery = {
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keywordLower}%` } },
                    ]
                },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            }
            // tìm kiếm bộ phận cơ thể
            const bodyPartQuery = {
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${keywordLower}%` } },
                    ]
                },
                attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown'],
                raw: true
            }
            // thực hiện truy vấn song song
            const [symptomsResult, drugsResult, herbsResult, bodyPartsResult] = await Promise.all([
                db.Symptom.findAndCountAll({
                    ...symptomQuery,
                    offset,
                    limit: limitNum
                }),
                db.Drug.findAndCountAll({
                    ...drugQuery,
                    offset,
                    limit: limitNum
                }),
                db.MedicinalHerb.findAndCountAll({
                    ...herbQuery,
                    offset,
                    limit: limitNum
                }),
                db.BodyPart.findAndCountAll({
                    ...bodyPartQuery,
                    offset,
                    limit: limitNum
                }),
            ]);
            // Xử lý hình ảnh cho phòng khám và chuyên khoa, cẩm nang
            const drugs = drugsResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            });

            const herbs = herbsResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            });

            const bodyParts = bodyPartsResult.rows.map(item => {
                if (item.image) {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                }
                return item;
            })


            // Tổng số kết quả
            const totalItems = symptomsResult.count + drugsResult.count + herbsResult.count + bodyPartsResult.count;
            const totalPages = Math.ceil(totalItems / limitNum);
            resolve({
                errCode: 0,
                errMessage: 'Tìm kiếm thành công',
                data: {
                    symptoms: symptomsResult.rows,
                    drugs,
                    herbs,
                    bodyParts,
                    totalItems,
                    totalPages,
                    currentPage: pageNum,
                    limit: limitNum
                }
            })
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    searchService, searchMedicalService
};