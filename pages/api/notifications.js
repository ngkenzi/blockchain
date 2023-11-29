// pages/api/notifications.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const response = await axios.get('http://localhost:4000/notifications');
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching notifications' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
