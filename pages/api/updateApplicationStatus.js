// pages/api/updateApplicationStatus.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, status } = req.body;

        // Check if both studentId and status are provided
        if (!studentId || !status) {
            return res.status(400).json({ message: 'Student ID and status are required' });
        }

        try {
            // Making a request to the actual API endpoint
            const response = await axios.post('http://localhost:4000/updateApplicationStatus', { studentId, status });
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error updating application status', error);
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
