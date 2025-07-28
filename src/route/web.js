import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import patientPDFController from "../controllers/patientPDFController";
import searchController from "../controllers/searchController";
import handbookController from "../controllers/handbookController";
import symptomController from "../controllers/symptomController.js";
import drugController from "../controllers/drugController.js";
import herbController from "../controllers/herbController.js";
import bodyPartController from "../controllers/bodyPartController.js";
import dashboardController from "../controllers/dashboardController";
import chatController from "../controllers/chatController.js";
import authenticateToken from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";

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
    router.post('/api/refresh-token', userController.handleRefreshToken); // refresh token
    router.post('/api/logout', authenticateToken, userController.handleLogout); // logout

    router.get(`/api/get-all-users`, userController.handleGetAllUsers); // hien thi all users
    router.post(`/api/create-new-user`, userController.handleCreateNewUser); // tao new user
    router.put(`/api/edit-user`, userController.handleEditUser);  // edit user
    router.delete(`/api/delete-user`, userController.handleDeleteUser); // delete user
    router.get('/api/get-user-profile', authenticateToken, userController.getUserProfile); // xem hồ sơ bệnh nhân

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
    router.get('/api/get-doctor-notifications', authenticateToken, doctorController.getDoctorNotifications); // gửi thông báo cho bác sĩ 
    router.post('/api/cancel-confirm', authenticateToken, doctorController.cancelConfirm);   // hủy lịch khám ở phía bác sĩ


    router.post('/api/patient-book-appointment', patientController.postBookAppointment);   // bệnh nhân đặt lịch khám
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);   // verify, xac nhan dat lich thanh cong
    router.post('/api/cancel-appointment', authenticateToken, patientController.cancelAppointment); // hủy lịch khám ở phía bệnh nhân

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);   // tạo chuyên khoa mới
    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty); // api lấy chuyên khoa
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById); // api lấy chuyên khoa
    router.delete(`/api/delete-specialty`, specialtyController.handleDeleteSpecialty); // api xóa chuyên khoa
    router.put(`/api/edit-specialty`, specialtyController.handleEditspecialty);  // edit chuyên khoa


    router.post('/api/create-new-clinic', clinicController.createClinic);   // tạo phong kham mới
    router.get('/api/get-all-clinic', clinicController.getAllClinic); // api lấy tat ca phong kham
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById); // api lấy phong kham chi tiet
    router.delete(`/api/delete-clinic`, clinicController.handleDeleteClinic); // api xóa phòng khám
    router.put(`/api/edit-clinic`, clinicController.handleEditClinic);  // edit phòng khám

    // cam nang
    router.post('/api/create-new-handbook', handbookController.createHandBook) // tao cam nang moi
    router.get('/api/get-all-handbook', handbookController.getAllHandBook)     // lat tat ca cam nang
    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandBookById); // api lấy cam nang chi tiet
    router.put(`/api/edit-handbook`, handbookController.handleEditHandBook);  // edit cam nang
    router.delete(`/api/delete-handbook`, handbookController.handleDeleteHandBook); // api xóa phòng khám

    // triệu chứng
    router.post('/api/create-new-symptom', symptomController.createSymptom); // tạo triệu chứng
    router.get('/api/get-all-symptom', symptomController.getAllSymptom);    // lấy tất cả triệu chứng
    router.get('/api/get-detail-symptom-by-id', symptomController.getSymptomById); // lấy chi tiêt triệu chứng
    router.put('/api/update-symptom', symptomController.updateSymptom); // cập nhật triệu chứng
    router.delete('/api/delete-symptom', symptomController.deleteSymptom); // xóa triệu chứng

    // thuốc
    router.post('/api/create-new-drug', drugController.createDrug); // tạo thuốc
    router.get('/api/get-all-drug', drugController.getAllDrug); // lấy tất cả thuốc
    router.get('/api/get-detail-drug-by-id', drugController.getDrugById); // lấy chi tiết thuốc
    router.put('/api/update-drug', drugController.updateDrug); // cập nhật thuốc
    router.delete('/api/delete-drug', drugController.deleteDrug); // xóa thuốc

    // dược liệu
    router.post('/api/create-new-medicinal-herb', herbController.createHerb); // tạo dược liệu
    router.get('/api/get-all-medicinal-herbs', herbController.getAllHerbs); // lấy tất cả dược liệu
    router.get('/api/get-detail-medicinal-herb-by-id', herbController.getHerbById); // lấy chi tiết dược liệu
    router.put('/api/update-medicinal-herb', herbController.updateHerb); // cập nhật dược liệu
    router.delete('/api/delete-medicinal-herb', herbController.deleteHerb); // xóa dược liệu

    // cơ thể
    router.post('/api/create-body-part', bodyPartController.createPart); // tạo mới
    router.get('/api/get-all-body-parts', bodyPartController.getAllParts); // lấy all
    router.get('/api/get-detail-body-part-by-id', bodyPartController.getPartById); // lấy chi tiết
    router.put('/api/update-body-part', bodyPartController.updatePart); // cập nhật
    router.delete('/api/delete-body-part', bodyPartController.deletePart); // xóa
    // tim kiem
    router.get('/api/search', searchController.search); // chức năng tìm kiếm
    router.get('/api/searchMedical', searchController.searchMedical); // chức năng tìm kiếm thuốc, dược liệu, triệu chứng, bộ phận cơ thể 

    // pdf
    router.get('/api/generate-patient-pdf', patientPDFController.generatePatientPDF);

    // dashboard
    router.get("/api/get-dashboard-data", dashboardController.getDashboardData);

    // chat message
    router.get('/api/messages', authenticateToken, chatController.getMessage); // lấy tin nhắn giữa user và bác sĩ
    router.post('/api/messages', authenticateToken, chatController.postMessage);  // gửi tin nhắn từ user và bác sĩ
    router.get('/api/online-users', authenticateToken, isAdmin, chatController.getOnlineUsers); // hiển thị người đang online

    return app.use("/", router);
}
module.exports = initWebRoutes;