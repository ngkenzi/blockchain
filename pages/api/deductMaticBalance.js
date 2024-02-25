// pages/api/deductMaticBalance.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { walletAddress, amountToDeduct } = req.body;

        try {
            const response = await axios.post('http://13.250.122.124:5000/deductMaticBalance', {
                walletAddress,
                amountToDeduct
            });

            res.status(200).json({ message: 'Matic balance deducted successfully', ...response.data });
        } catch (error) {
            console.error('Error deducting Matic balance:', error);
            if (error.response) {
                res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
