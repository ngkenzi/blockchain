// pages/api/getMeetingsByUserId.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { studentId } = req.query;

        // Check if studentId is provided
        if (!studentId) {
            return res.status(400).json({ message: 'Student ID is required' });
        }

        try {
            // Making a request to the actual API endpoint
            const response = await axios.get('http://localhost:4000/getMeetingsByUserId', {
                params: { studentId }
            });
            res.status(200).json(response.data);
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
