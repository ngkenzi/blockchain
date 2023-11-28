// api/getNotificationStatus.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { recipientWalletAddress } = req.query;

        // Check if recipientWalletAddress is provided
        if (!recipientWalletAddress) {
            return res.status(400).json({ message: 'Recipient wallet address is required' });
        }

        try {
            const response = await axios.get(`http://localhost:4000/notifications/status/${recipientWalletAddress}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                res.status(404).json({ message: 'No notifications found for this recipient' });
            } else {
                res.status(500).json({ message: 'Error fetching notification status' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
