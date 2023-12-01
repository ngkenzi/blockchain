// pages/api/acceptInvite.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { inviteId } = req.query;

        try {
            // Forward the request to your backend service
            const response = await axios.post(`http://localhost:4000/invites/${inviteId}/accept`);
            // Send the response back to the frontend
            res.status(200).json({ success: true, message: 'Invite accepted successfully' });
        } catch (error) {
            console.error('Error accepting invite:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json({ success: false, message: error.response.data });
            } else {
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
