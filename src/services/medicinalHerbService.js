import db from "../models/index";

let createHerbService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin cần thiết"
                });
                return;
            }
            await db.MedicinalHerb.create({
                name: data.name,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image || null
            });
            resolve({
                errCode: 0,
                message: "Tạo dược liệu thành công!"
            });

        } catch (e) {
            console.error("Lỗi createHerbService:", e);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + e.message
            });
        }
    })
}

let getAllHerbsService = async (page = 1, limit = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const { count, rows } = await db.MedicinalHerb.findAndCountAll({
                offset,
                limit: limitNum,
                order: [['id', 'ASC']]
            });
            const totalPages = Math.ceil(count / limitNum);
            resolve({
                errCode: 0,
                message: "Lấy danh sách dược liệu thành công!",
                data: {
                    herbs: rows,
                    currentPage: pageNum,
                    totalPages,
                    totalItems: count
                }
            });
        } catch (error) {
            console.error("Lỗi getAllHerbsService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let getHerbByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }
            const herb = await db.MedicinalHerb.findOne({
                where: { id }
            });
            if (!herb) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy dược liệu"
                });
                return;
            }
            resolve({
                errCode: 0,
                message: "Lấy thông tin chi tiết dược liệu thành công",
                data: herb
            });
        } catch (error) {
            console.error("Lỗi getHerbByIdService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let updateHerbService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin: id, name, descriptionHTML hoặc descriptionMarkdown"
                });
                return;
            }
            const herb = await db.MedicinalHerb.findOne({
                where: { id: data.id }
            });
            if (!herb) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy dược liệu để cập nhật"
                });
                return;
            }
            herb.name = data.name;
            herb.descriptionHTML = data.descriptionHTML;
            herb.descriptionMarkdown = data.descriptionMarkdown;
            if (data.image) herb.image = data.image;

            await herb.save();
            resolve({
                errCode: 0,
                message: "Cập nhật dược liệu thành công!"
            });
        } catch (error) {
            console.error("Lỗi updateHerbService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}

let deleteHerbService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu tham số id"
                });
                return;
            }
            const herb = await db.MedicinalHerb.findOne({ where: { id } });
            if (!herb) {
                resolve({
                    errCode: 2,
                    errMessage: "Không tìm thấy dược liệu"
                });
                return;
            }
            await db.MedicinalHerb.destroy({ where: { id } });
            resolve({
                errCode: 0,
                message: "Xóa thuốc thành công!"
            });
        } catch (error) {
            console.error("Lỗi deleteHerbService:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi server: " + error.message
            });
        }
    })
}
module.exports = {
    createHerbService: createHerbService,
    getAllHerbsService: getAllHerbsService,
    getHerbByIdService: getHerbByIdService,
    updateHerbService: updateHerbService,
    deleteHerbService: deleteHerbService,
}