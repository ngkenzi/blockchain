// pages/api/updateMeetingStatus.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { meetingId, status } = req.body;

        // Check if both meetingId and status are provided
        if (!meetingId || !status) {
            return res.status(400).json({ message: 'Meeting ID and status are required' });
        }

        try {
            // Making a request to your actual backend server
            const backendResponse = await axios.post('http://13.250.122.124:5000/updateMeetingStatus', { meetingId, status });
            res.status(200).json(backendResponse.data);
        } catch (error) {
            console.error('Error updating meeting status:', error);
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
