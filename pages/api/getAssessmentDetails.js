// api/getAssessmentDetails.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const walletAddress = req.query.walletAddress;

        // Check if walletAddress is provided
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        try {
            const response = await axios.get(`http://localhost:4000/assessment-details/${walletAddress}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                res.status(404).json({ message: 'Assessment details not found' });
            } else {
                res.status(500).json({ message: 'Error fetching assessment details' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
