import patientPDFService from "../services/patientPDFService";

let generatePatientPDF = async (req, res) => {
    try {
        const bookingId = req.query.bookingId;
        if (!bookingId) {
            return res.status(400).json({
                errCode: 1,
                errMessage: 'Missing required parameter: bookingId'
            });
        }
        let response = await patientPDFService.generatePatientPDFService(bookingId);
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })

    }
}



module.exports = {
    generatePatientPDF: generatePatientPDF

} 