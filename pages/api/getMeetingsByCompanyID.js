// pages/api/getMeetingsByCompanyID.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { companyId } = req.query;

        // Check if companyId is provided
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        try {
            // Making a request to your actual backend server
            const backendResponse = await axios.get(`http://13.250.122.124:5000/getMeetings?companyId=${companyId}`);
            const meetings = backendResponse.data.meetings;

            res.status(200).json({ meetings });
        } catch (error) {
            console.error('Error fetching meetings:', error);
            if (error.response) {
                // Forward the status code and message from the actual API
                res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
