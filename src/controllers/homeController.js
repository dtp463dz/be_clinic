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
    // console.log('----------')
    // console.log(data);
    // console.log('----------')
    return res.render('displayCRUD.ejs', {
        // chuyền 1 biến sang view
        dataTable: data,
    });
}

// update crud
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);
    // validate
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        // check userData not found

        return res.render('editCRUD.ejs', {
            // truyền qua view
            user: userData // userData gắn cho user
        });

    } else {
        return res.send('user not found');
    }
    console.log(req.query.id);  // lấy id của user

}

// update user form
let putCRUD = async (req, res) => {
    let data = req.body;

    let allUser = await CRUDService.updateUserData(data);
    // sau khi đã update thành công cần hiển thị phần update ở display user
    return res.render('displayCRUD.ejs', {
        // chuyền 1 biến sang view
        // update lại all user vào data table
        dataTable: allUser,
    });
    // return res.send('update done!');

}


module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
}