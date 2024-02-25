// api/applyForJob.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const applicationData = req.body;

        try {
            const response = await axios.post('http://13.250.122.124:5000/applyForJob', applicationData);
            res.status(200).json({ success: true, message: 'Application submitted successfully' });
        } catch (error) {
            console.error('Error submitting application:', error);
            if (error.response) {
                // Pass the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data.message, success: false });
            } else {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
