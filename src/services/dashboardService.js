import db from "../models/index";
import { Op } from "sequelize";

let getDashboardDataService = (startDate, endDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Tổng số liệu thống kê
            const totalPatients = await db.User.count({
                where: { roleId: "R3" }, // Bệnh nhân
            });

            const totalClinics = await db.Clinic.count();

            const totalAppointments = await db.Booking.count({
                where: {
                    statusId: "S2", // Lịch hẹn đã xác nhận
                    ...(startDate && endDate
                        ? { date: { [Op.between]: [startDate, endDate] } }
                        : {}),
                },
            });

            // Tính doanh thu dựa trên các lịch hẹn đã hoàn tất
            const revenueData = await db.Booking.findAll({
                where: {
                    statusId: "S3", // Lịch hẹn đã hoàn tất
                    ...(startDate && endDate
                        ? { date: { [Op.between]: [startDate, endDate] } }
                        : {}),
                },
                include: [
                    {
                        model: db.User,
                        as: "patientData",
                        attributes: [],
                        include: [
                            {
                                model: db.Doctor_Infor,
                                as: "Doctor_Infor",
                                attributes: ["priceId"],
                                include: [
                                    {
                                        model: db.Allcode,
                                        as: "priceTypeData",
                                        attributes: ["valueVi"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                attributes: ["id"],
                raw: true,
                nest: true,
            });

            const totalRevenue = revenueData.reduce((sum, booking) => {
                const price = parseFloat(
                    booking.patientData.Doctor_Infor?.priceTypeData?.valueVi || 0
                );
                return sum + (isNaN(price) ? 0 : price);
            }, 0);

            // 2. Dữ liệu biểu đồ (theo tháng)
            const chartData = [];
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            for (let i = 0; i < 6; i++) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
                    .getTime()
                    .toString();
                const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
                    .getTime()
                    .toString();

                const patients = await db.Booking.count({
                    where: {
                        statusId: "S2",
                        date: { [Op.between]: [monthStart, monthEnd] },
                    },
                });

                const revenue = await db.Booking.findAll({
                    where: {
                        statusId: "S3",
                        date: { [Op.between]: [monthStart, monthEnd] },
                    },
                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: [],
                            include: [
                                {
                                    model: db.Doctor_Infor,
                                    as: "Doctor_Infor",
                                    attributes: ["priceId"],
                                    include: [
                                        {
                                            model: db.Allcode,
                                            as: "priceTypeData",
                                            attributes: ["valueVi"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    attributes: ["id"],
                    raw: true,
                    nest: true,
                }).then((bookings) =>
                    bookings.reduce((sum, booking) => {
                        const price = parseFloat(
                            booking.patientData.Doctor_Infor?.priceTypeData?.valueVi || 0
                        );
                        return sum + (isNaN(price) ? 0 : price);
                    }, 0)
                );

                chartData.push({
                    name: months[date.getMonth()],
                    patients,
                    revenue,
                });
            }

            // 3. Hoạt động gần đây
            const recentActivities = await db.Booking.findAll({
                where: { statusId: ["S2", "S3"] },
                include: [
                    {
                        model: db.User,
                        as: "patientData",
                        attributes: ["firstName", "lastName"],
                    },
                    {
                        model: db.User,
                        as: "doctorData", // Sử dụng alias đúng
                        attributes: ["firstName", "lastName"],
                    },
                    {
                        model: db.Allcode,
                        as: "timeTypeDataPatient",
                        attributes: ["valueVi"],
                    },
                ],
                attributes: ["id", "date", "statusId", "timeType"],
                limit: 5,
                order: [["createdAt", "DESC"]],
                raw: true,
                nest: true,
            });

            const formattedActivities = recentActivities.map((activity) => ({
                date: activity.date
                    ? new Date(parseInt(activity.date)).toISOString().split("T")[0]
                    : "N/A",
                patient: `${activity.patientData.firstName || ''} ${activity.patientData.lastName || ''}`,
                doctor: `${activity.doctorData.firstName || ''} ${activity.doctorData.lastName || ''}`,
                action: activity.timeTypeDataPatient.valueVi || "N/A",
                status:
                    activity.statusId === "S2"
                        ? "Confirmed"
                        : activity.statusId === "S3"
                            ? "Completed"
                            : "Pending",
            }));

            resolve({
                errCode: 0,
                errMessage: "Lấy dữ liệu dashboard thành công",
                data: {
                    metrics: {
                        totalPatients,
                        totalClinics,
                        totalAppointments,
                        totalRevenue,
                    },
                    chartData: chartData.reverse(),
                    recentActivities: formattedActivities,
                },
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getDashboardDataService,
};