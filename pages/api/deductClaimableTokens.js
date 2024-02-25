// pages/api/deductClaimableTokens.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { walletAddress, amountToDeduct } = req.body;

        try {
            const response = await axios.post('http://13.250.122.124:5000/deductClaimableTokens', {
                walletAddress,
                amountToDeduct
            });

            // Assuming the backend service responds with a success message
            res.status(200).json({ message: 'Claimable tokens deducted successfully', ...response.data });
        } catch (error) {
            console.error('Error deducting claimable tokens:', error);
            if (error.response) {
                // Pass the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
