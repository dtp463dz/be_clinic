import db from "../models/index";

let createPartService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin cần thiết"
                });
                return;
            }
            await db.BodyPart.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image || null
            });
            resolve({
                errCode: 0,
                message: "Tạo bộ phận cơ thể thành công!"
            });
        } catch (error) {
            console.error("Lỗi createPartService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let getAllPartsService = async (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const { count, rows } = await db.BodyPart.findAndCountAll({
                offset,
                limit: limitNum,
                order: [['id', 'ASC']]
            });
            const totalPages = Math.ceil(count / limitNum);
            resolve({
                errCode: 0,
                message: "Lấy danh sách bộ phận cơ thể thành công!",
                data: {
                    bodyParts: rows,
                    currentPage: pageNum,
                    totalPages,
                    totalItems: count
                }
            });
        } catch (error) {
            console.error("Lỗi getAllDrugService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let getPartByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }
            const bodypart = await db.BodyPart.findOne({
                where: { id }
            });
            if (!bodypart) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy bộ phận cơ thể"
                });
                return;
            }
            resolve({
                errCode: 0,
                message: "Lấy thông tin chi tiết bộ phận cơ thể thành công",
                data: bodypart
            });
        } catch (error) {
            console.error("Lỗi getPartByIdService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let updatePartService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra các trường bắt buộc
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin: id, name, descriptionHTML hoặc descriptionMarkdown"
                });
                return;
            }

            // Tìm bản ghi với findByPk, đảm bảo không dùng raw: true
            const bodyPart = await db.BodyPart.findByPk(data.id, {
                raw: false
            });
            console.log('BodyPart found:', bodyPart); // Debug
            console.log('Is Sequelize instance:', bodyPart instanceof db.BodyPart); // Debug

            if (!bodyPart) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy bộ phận cơ thể để cập nhật"
                });
                return;
            }

            // Kiểm tra xem bodyPart có phải là instance của Sequelize Model
            if (!(bodyPart instanceof db.BodyPart)) {
                console.error('BodyPart is not a Sequelize instance:', bodyPart);
                reject({
                    errCode: -1,
                    errMessage: "Lỗi server: bodyPart không phải là instance của Sequelize Model"
                });
                return;
            }

            // Cập nhật dữ liệu
            bodyPart.name = data.name;
            bodyPart.descriptionHTML = data.descriptionHTML;
            bodyPart.descriptionMarkdown = data.descriptionMarkdown;
            if (data.image) {
                bodyPart.image = data.image;
            }

            await bodyPart.save();
            resolve({
                errCode: 0,
                message: "Cập nhật bộ phận cơ thể thành công!"
            });
        } catch (error) {
            console.error("Lỗi updatePartService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    });
};

let deletePartService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }
            const bodypart = await db.BodyPart.findOne({
                where: { id }
            });
            if (!bodypart) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy bộ phận cơ thể để xóa"
                });
                return;
            }
            await db.BodyPart.destroy({ where: { id } });
            resolve({
                errCode: 0,
                message: "Xóa bộ phận cơ thể thành công!"
            });

        } catch (error) {
            console.error("Lỗi deletePartService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

module.exports = {
    createPartService: createPartService,
    getAllPartsService: getAllPartsService,
    getPartByIdService: getPartByIdService,
    updatePartService: updatePartService,
    deletePartService: deletePartService,

}