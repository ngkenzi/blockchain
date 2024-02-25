import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'GET') {
        const { walletAddress } = req.query;

        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        try {
            const response = await axios.get(`http://13.250.122.124:5000/get-avatar-url?walletAddress=${walletAddress}`);

            if (response.data.avatarUrl && response.data.avatarUrl !== "") {
                res.status(200).json({ avatarUrl: response.data.avatarUrl });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error("Error fetching avatar URL:", error);
            res.status(error.response?.status || 500).json(error.response?.data || {});
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};
