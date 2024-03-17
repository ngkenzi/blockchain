// pages/api/getInviteById.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { inviteId } = req.query;

        try {
            // Forward the request to your backend service
            const response = await axios.get(`http://13.250.122.124:5000/invites/id/${inviteId}`);
            // Send the response back to the frontend
            if (response.data) {
                res.status(200).json(response.data);
            } else {
                res.status(404).json({ message: 'Invite not found' });
            }
        } catch (error) {
            console.error('Error fetching invite by ID:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
