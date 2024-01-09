// pages/api/jobOffers.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { companyId } = req.query;

        try {
            const response = await axios.get(`http://localhost:4000/jobOffers/${companyId}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching job offers:', error);
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
