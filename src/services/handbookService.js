import db from "../models/index";

let createHandBookService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.author || !data.author || !data.publicationDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Thiếu các trường bắt buộc'
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
            // Tạo mới
            const handbook = await db.HandBook.create({
                author: data.author,
                title: data.title,
                descriptionHTML: data.descriptionHTML,
                descriptionMarkdown: data.descriptionMarkdown,
                image: data.image,
                publicationDate: data.publicationDate,
                lastUpdateDate: data.lastUpdateDate || null,
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

module.exports = {
    createHandBookService: createHandBookService,
} 