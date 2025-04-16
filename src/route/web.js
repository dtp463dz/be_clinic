import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

// quy định hết route bên trong file web.js này 
let initWebRoutes = (app) => {

    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/home', (req, res) => {
        return res.send('Home')
    });

    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);

    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    // api
    router.post('/api/login', userController.handleLogin); // login
    router.get(`/api/get-all-users`, userController.handleGetAllUsers); // hien thi all users
    router.post(`/api/create-new-user`, userController.handleCreateNewUser); // tao new user

    // rest api
    return app.use("/", router);
}
module.exports = initWebRoutes;