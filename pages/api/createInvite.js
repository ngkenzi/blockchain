// pages/api/createInvite.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const inviteData = req.body;

        try {
            // Forward the request to your backend service
            const response = await axios.post('http://localhost:4000/invites', inviteData);
            // Send the response back to the frontend
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Error creating invite:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json({ success: false, message: error.response.data });
            } else {
                res.status(500).json({ success: false });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
