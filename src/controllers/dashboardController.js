import dashboardService from "../services/dashboardService";

let getDashboardData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query; // Lọc theo khoảng thời gian nếu cần
        let response = await dashboardService.getDashboardDataService(startDate, endDate);
        return res.status(200).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Lỗi từ server...'
        });
    }
};

module.exports = {
    getDashboardData,
};