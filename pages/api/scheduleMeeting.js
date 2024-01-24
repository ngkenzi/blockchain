// pages/api/scheduleMeeting.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { studentId, companyId, meetingLink, scheduledTime } = req.body;

        // Validate the input
        if (!studentId || !companyId || !meetingLink || !scheduledTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Forward the request to the actual backend server
            const response = await axios.post('http://localhost:4000/scheduleMeeting', {
                studentId,
                companyId,
                meetingLink,
                scheduledTime
            });

            // Forward the backend server's response to the client
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error scheduling meeting', error);
            if (error.response) {
                // Forward the status code and message from the backend server
                res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
