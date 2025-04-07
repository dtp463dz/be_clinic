import express from "express";
import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll(); // tham chiếu đến bảng User(phân biệt chữ hoa chữ thường) trong db
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
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}
// create new crud
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    // console.log(req.body); // in ra body ben form
    return res.send('post crud from server');
}
// read (display) crud
let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log('----------')
    console.log(data);
    console.log('----------')
    return res.render('displayCRUD.ejs', {
        // chuyền 1 biến sang view
        dataTable: data,
    });
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,

}