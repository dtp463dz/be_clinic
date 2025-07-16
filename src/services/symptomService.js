import db from "../models/index";

let createSymptomService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc: name, descriptionHTML hoặc descriptionMarkdown"
                });
                return;
            }

            await db.Symptom.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image || null
            });

            resolve({
                errCode: 0,
                message: "Tạo triệu chứng thành công!"
            });
        } catch (error) {
            console.error("Lỗi createSymptomService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let getAllSymptomService = async (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;

            const { count, rows } = await db.Symptom.findAndCountAll({
                offset,
                limit: limitNum,
                order: [['id', 'ASC']]
            });

            const totalPages = Math.ceil(count / limitNum);

            resolve({
                errCode: 0,
                message: "Lấy danh sách triệu chứng thành công!",
                data: {
                    symptoms: rows,
                    currentPage: pageNum,
                    totalPages,
                    totalItems: count
                }
            });
        } catch (error) {
            console.error("Lỗi getAllSymptomService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })

}

let getSymptomByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }

            const symptom = await db.Symptom.findOne({
                where: { id }
            });

            if (!symptom) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy triệu chứng"
                });
                return;
            }

            resolve({
                errCode: 0,
                message: "Lấy thông tin triệu chứng thành công",
                data: symptom
            });
        } catch (error) {
            console.error("Lỗi getSymptomByIdService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    });
}

let updateSymptomService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin: id, name, descriptionHTML hoặc descriptionMarkdown"
                });
                return;
            }
            const symptom = await db.Symptom.findOne({
                where: { id: data.id }
            });

            if (!symptom) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy triệu chứng để cập nhật"
                });
                return;
            }

            symptom.name = data.name;
            symptom.descriptionHTML = data.descriptionHTML;
            symptom.descriptionMarkdown = data.descriptionMarkdown;

            if (data.image) {
                symptom.image = data.image;
            }

            await symptom.save();
            resolve({
                errCode: 0,
                message: "Cập nhật triệu chứng thành công!"
            });

        } catch (error) {
            console.error("Lỗi updateSymptomService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let deleteSymptomService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }

            const symptom = await db.Symptom.findOne({ where: { id } });

            if (!symptom) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy triệu chứng để xóa"
                });
                return;
            }

            await db.Symptom.destroy({ where: { id } });

            resolve({
                errCode: 0,
                message: "Xóa triệu chứng thành công!"
            });
        } catch (error) {
            console.error("Lỗi deleteSymptomService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    });
}
module.exports = {
    createSymptomService: createSymptomService,
    getAllSymptomService: getAllSymptomService,
    getSymptomByIdService: getSymptomByIdService,
    updateSymptomService: updateSymptomService,
    deleteSymptomService: deleteSymptomService,
}
