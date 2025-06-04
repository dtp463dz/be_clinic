import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
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

    // restApi
    router.post('/api/register', userController.handleRegister); // register
    router.post('/api/login', userController.handleLogin); // login
    router.get(`/api/get-all-users`, userController.handleGetAllUsers); // hien thi all users
    router.post(`/api/create-new-user`, userController.handleCreateNewUser); // tao new user
    router.put(`/api/edit-user`, userController.handleEditUser);  // edit user
    router.delete(`/api/delete-user`, userController.handleDeleteUser); // delete user

    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome); // api bác sĩ nổi bật (home)

    router.get('/api/get-all-doctor', doctorController.getAllDoctor); // lấy tất cả bác sĩ
    router.post('/api/save-infor-doctors', doctorController.postInforDoctors); // lưu thông tin bác sĩ
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById); // lấy thông tin chi tiết bác sĩ qua id

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule); // tạo nhiều lịch khám của bác sĩ 

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);   // lấy tất cả lịch khám của bác sĩ

    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);   // lấy thông tin mở rộng (phòng khám, giá, địa chỉ) của bác sĩ thông qua id



    return app.use("/", router);
}
module.exports = initWebRoutes;