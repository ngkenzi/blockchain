// api/checkSubmissionStatus.js
import axios from 'axios';

async function fetchWithRetry(url, retries, delay) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying... attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay);
        } else {
            throw error;
        }
    }
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { walletAddress } = req.query;

        // Check if walletAddress is provided
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        try {
            const response = await axios.get(`http://localhost:4000/check-submission/${walletAddress}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                res.status(404).json({ message: 'No submission found for this wallet address' });
            } else {
                console.error(error);
                res.status(500).json({ message: 'Error fetching submission status' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
