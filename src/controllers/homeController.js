import express from "express";
import db from "../models/index";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll(); // tham chiếu đến bảng User(phân biệt chữ hoa chữ thường) trong db
        console.log('-----------------------')
        console.log(data)
        console.log('-----------------------')
        return res.render('homepage.ejs', {
            data: JSON.stringify(data) // chuyen file JSON thành chuỗi string
        });
    } catch (e) {
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

// object: {
//     key: '',
//     value: ''
// }
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
}