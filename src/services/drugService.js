import db from "../models/index";

let createDrugService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin cần thiết"
                });
                return;
            }
            await db.Drug.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image || null
            });
            resolve({
                errCode: 0,
                message: "Tạo thuốc thành công!"
            });

        } catch (e) {
            console.error("Lỗi createDrugService:", e);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + e.message
            });
        }
    })
}

let getAllDrugService = async (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;

            const { count, rows } = await db.Drug.findAndCountAll({
                offset,
                limit: limitNum,
                order: [['id', 'ASC']]
            });
            const totalPages = Math.ceil(count / limitNum);
            resolve({
                errCode: 0,
                message: "Lấy danh sách thuốc thành công!",
                data: {
                    drugs: rows,
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

let getDrugByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }
            const drug = await db.Drug.findOne({
                where: { id }
            });
            if (!drug) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy thuốc"
                });
                return;
            }
            resolve({
                errCode: 0,
                message: "Lấy thông tin chi tiết thuốc thành công",
                data: drug
            });
        } catch (error) {
            console.error("Lỗi getDrugByIdService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let updateDrugService = (data) => {
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
            const drug = await db.Drug.findByPk(data.id, {
                raw: false
            });

            if (!drug) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy thuốc để cập nhật"
                });
                return;
            }

            // Kiểm tra xem drug có phải là instance của Sequelize Model
            if (!(drug instanceof db.Drug)) {
                console.error('Drug is not a Sequelize instance:', drug);
                reject({
                    errCode: -1,
                    errMessage: "Lỗi server: drug không phải là instance của Sequelize Model"
                });
                return;
            }

            // Cập nhật dữ liệu
            drug.name = data.name;
            drug.descriptionHTML = data.descriptionHTML;
            drug.descriptionMarkdown = data.descriptionMarkdown;
            if (data.image) {
                drug.image = data.image;
            }

            await drug.save();
            resolve({
                errCode: 0,
                message: "Cập nhật thuốc thành công!"
            });
        } catch (error) {
            console.error("Lỗi updateDrugService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    });
};

let deleteDrugService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }

            const drug = await db.Drug.findOne({ where: { id } });
            if (!drug) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy thuốc để xóa"
                });
                return;
            }
            await db.Drug.destroy({ where: { id } });
            resolve({
                errCode: 0,
                message: "Xóa thuốc thành công!"
            });
        } catch (error) {
            console.error("Lỗi deleteDrugService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}
module.exports = {
    createDrugService: createDrugService,
    getAllDrugService: getAllDrugService,
    getDrugByIdService: getDrugByIdService,
    updateDrugService: updateDrugService,
    deleteDrugService: deleteDrugService,
}