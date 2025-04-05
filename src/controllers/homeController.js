import express from "express";

let getHomePage = (req, res) => {
    return res.send("Hello World from controller")
}

let getHomePageView = (req, res) => {
    return res.render('homepage.ejs');
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
    getHomePageView: getHomePageView,
    getAboutPage: getAboutPage,
}