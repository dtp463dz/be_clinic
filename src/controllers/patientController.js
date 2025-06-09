import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let response = await patientService.postBookAppointmentService(req.body);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}
module.exports = {
    postBookAppointment: postBookAppointment
}