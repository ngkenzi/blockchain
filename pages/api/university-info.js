import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'GET') {
        const { walletAddress } = req.query;

        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        try {
            // Change the URL below to your actual API endpoint
            const response = await axios.get(`http://localhost:4000/user-university?walletAddress=${walletAddress}`);

            if (response.data.universityName) {
                res.status(200).json({ universityName: response.data.universityName });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error("Error fetching university info:", error);
            res.status(error.response?.status || 500).json(error.response?.data || {});
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
