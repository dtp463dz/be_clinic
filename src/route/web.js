import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import patientPDFController from "../controllers/patientPDFController";

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
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);   // lấy thông tin profile của bác sĩ thông qua id

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);   // lấy danh sách bệnh nhân từ bác sĩ
    router.post('/api/send-confirm', doctorController.sendConfirm);   // lưu thông tin modal hóa đơn khám bệnh 


    router.post('/api/patient-book-appointment', patientController.postBookAppointment);   // lấy thông tin profile của bác sĩ thông qua id
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);   // verify, xac nhan dat lich thanh cong

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);   // tạo chuyên khoa mới
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty); // api lấy chuyên khoa
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById); // api lấy chuyên khoa
    router.delete(`/api/delete-specialty`, specialtyController.handleDeleteSpecialty); // api xóa chuyên khoa
    router.put(`/api/edit-specialty`, specialtyController.handleEditspecialty);  // edit chuyên khoa


    router.post('/api/create-new-clinic', clinicController.createClinic);   // tạo chuyên khoa mới
    router.get('/api/get-all-clinic', clinicController.getAllClinic); // api lấy tat ca phong kham
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById); // api lấy phong kham chi tiet
    router.delete(`/api/delete-clinic`, clinicController.handleDeleteClinic); // api xóa phòng khám
    router.put(`/api/edit-clinic`, clinicController.handleEditClinic);  // edit phòng khám


    // pdf
    router.get('/api/generate-patient-pdf', patientPDFController.generatePatientPDF);



    return app.use("/", router);
}
module.exports = initWebRoutes;