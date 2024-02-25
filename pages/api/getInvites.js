// pages/api/getInvites.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { recipientWalletAddress } = req.query;

        try {
            // Forward the request to your backend service
            const response = await axios.get(`http://13.250.122.124:5000/invites/${recipientWalletAddress}`);
            // Send the response back to the frontend
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching invites:', error);
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
