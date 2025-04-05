import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

// quy định hết route bên trong file web.js này 
let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage);
    router.get('/views', homeController.getHomePageView);
    router.get('/about', homeController.getAboutPage);

    router.get('/home', (req, res) => {
        return res.send('Home')
    });
    // rest api
    return app.use("/", router);
}
module.exports = initWebRoutes;