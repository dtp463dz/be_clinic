import express from "express";


let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views") // đã thiết lập tất cả file views nằm trong thư mục src/views
}

module.exports = configViewEngine;