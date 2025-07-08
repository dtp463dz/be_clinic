import db from "../models/index";

let createHandBookService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.author || !data.title || !data.publicationDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các trường bắt buộc: author, title, publicationDate'
                })
            }
            // Kiểm tra title đã tồn tại chưa
            const existingHandBook = await db.HandBook.findOne({
                where: {
                    title: data.title
                }
            });
            if (existingHandBook) {
                return resolve({
                    errCode: 2,
                    errMessage: 'Tiêu đề cẩm nang đã tồn tại'
                })
            }
            let publicationDateStr = null;
            if (data.publicationDate) {
                const timestamp = Number(data.publicationDate);
                if (!isNaN(timestamp) && timestamp > 0) {
                    publicationDateStr = timestamp.toString();
                } else {
                    console.log("Invalid publicationDate:", data.publicationDate);
                    return resolve({
                        errCode: 3,
                        errMessage: 'publicationDate phải là timestamp hợp lệ'
                    });
                }
            }
            let lastUpdateDateStr = null;
            if (data.lastUpdateDate) {
                const timestamp = Number(data.lastUpdateDate);
                if (!isNaN(timestamp) && timestamp > 0) {
                    lastUpdateDateStr = timestamp.toString();
                } else {
                    console.log("Invalid lastUpdateDate:", data.lastUpdateDate);
                    return resolve({
                        errCode: 3,
                        errMessage: 'lastUpdateDate phải là timestamp hợp lệ'
                    });
                }
            }
            // Tạo mới
            const handbook = await db.HandBook.create({
                author: data.author,
                title: data.title,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image,
                publicationDate: publicationDateStr,
                lastUpdateDate: lastUpdateDateStr,
            });
            resolve({
                errCode: 0,
                errMessage: "Tạo cẩm nang thành công",
                data: handbook
            });

        } catch (e) {
            reject({
                errCode: -1,
                errMessage: 'Lỗi server: ' + e.message
            });
        }
    })
}

let getAllHandBookService = (page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 10;
            const offset = (pageNum - 1) * limitNum;

            let { count, rows: data } = await db.HandBook.findAndCountAll({
                attributes: [
                    'id',
                    'author',
                    'title',
                    'descriptionHTML',
                    'descriptionMarkdown',
                    'image',
                    'publicationDate',
                    'lastUpdateDate',
                    'createdAt',
                    'updatedAt'
                ],
                offset: offset,
                limit: limitNum,
                order: [['publicationDate', 'DESC']]
            })
            const totalPages = Math.ceil(count / limitNum);
            // Xử lý image và format ngày
            if (data && data.length > 0) {
                data = data.map(item => {
                    // Chỉ xử lý image nếu không phải null
                    if (item.image) {
                        item.image = Buffer.from(item.image, 'base64').toString('binary');
                    }
                    // Chuyển chuỗi timestamp thành định dạng ngày (nếu cần)
                    item.publicationDate = item.publicationDate
                        ? new Date(parseInt(item.publicationDate)).toISOString()
                        : null;
                    item.lastUpdateDate = item.lastUpdateDate
                        ? new Date(parseInt(item.lastUpdateDate)).toISOString()
                        : null;
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: 'Lấy danh sách cẩm nang thành công',
                data: {
                    handbooks: data,
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: pageNum,
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailHandBookByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu trường bắt buộc '
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: [
                        'id',
                        'author',
                        'title',
                        'descriptionHTML',
                        'descriptionMarkdown',
                        'image',
                        'publicationDate',
                        'lastUpdateDate',
                    ],
                })
                if (!data) {
                    return resolve({
                        errCode: 404,
                        errMessage: 'Không tìm thấy cẩm nang với ID này'
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Lấy cẩm nang thành công',
                    data
                })
            }
        } catch (e) {
            reject({
                errCode: -1,
                errMessage: 'Lỗi server: ' + e.message
            });
        }
    })
}

let updateHandBookService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.author || !data.title || !data.publicationDate) {
                resolve({
                    errCode: 2,
                    errMessage: 'Cẩm nang không hợp lệ'
                })
            }
            // Kiểm tra title đã tồn tại (ngoại trừ bản ghi hiện tại)
            const existingHandBook = await db.HandBook.findOne({
                where: {
                    title: data.title,
                    id: {
                        [db.Sequelize.Op.ne]: data.id
                    } // ko kiểm tra bản ghi hiện tại
                }
            })
            if (existingHandBook) {
                return resolve({
                    errCode: 3,
                    errMessage: 'Tiêu đề cẩm nang đã tồn tại'
                });
            }
            // Xử lý publicationDate
            let publicationDateStr = null;
            if (data.publicationDate) {
                const timestamp = Number(data.publicationDate);
                if (!isNaN(timestamp) && timestamp > 0) {
                    publicationDateStr = timestamp.toString();
                } else {
                    console.log("Invalid publicationDate:", data.publicationDate);
                    return resolve({
                        errCode: 4,
                        errMessage: 'publicationDate phải là timestamp hợp lệ'
                    });
                }
            }
            // Xử lý lastUpdateDate
            let lastUpdateDateStr = null;
            if (data.lastUpdateDate) {
                const timestamp = Number(data.lastUpdateDate);
                if (!isNaN(timestamp) && timestamp > 0) {
                    lastUpdateDateStr = timestamp.toString();
                } else {
                    console.log("Invalid lastUpdateDate:", data.lastUpdateDate);
                    return resolve({
                        errCode: 4,
                        errMessage: 'lastUpdateDate phải là timestamp hợp lệ'
                    });
                }
            }
            let handbooks = await db.HandBook.findOne({
                where: { id: data.id },
                raw: false
            })
            if (handbooks) {
                handbooks.author = data.author;
                handbooks.title = data.title;
                handbooks.descriptionHTML = data.descriptionHTML;
                handbooks.descriptionMarkdown = data.descriptionMarkdown;
                handbooks.image = data.image;
                handbooks.publicationDate = publicationDateStr;
                handbooks.lastUpdateDate = lastUpdateDateStr;
                await handbooks.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Cập nhật cẩm nang thành công'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Cập nhật cẩm nang không thành công'
                })
            }
        } catch (e) {
            reject({
                errCode: -1,
                errMessage: 'Lỗi server: ' + e.message
            });
        }
    })
}

let handleDeleteHandBookService = async (handbookId) => {
    try {
        let deleteRows = await db.HandBook.destroy({
            where: { id: handbookId }
        })
        if (deleteRows === 0) {
            return {
                errCode: 2,
                errMessage: 'Cẩm nang không tồn tại'
            };
        }
        return {
            errCode: 0,
            errMessage: 'Xóa cẩm nang thành công'
        }
    } catch (e) {
        throw new Error('Lỗi khi xóa phòng khám: ' + e.message)
    }
}
module.exports = {
    createHandBookService: createHandBookService,
    getAllHandBookService: getAllHandBookService,
    getDetailHandBookByIdService: getDetailHandBookByIdService,
    updateHandBookService: updateHandBookService,
    handleDeleteHandBookService: handleDeleteHandBookService,
} 