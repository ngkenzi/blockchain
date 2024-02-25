import axios from 'axios';

async function handler(req, res) {
    if (req.method === 'POST') {
        const walletAddress = req.query.walletAddress;

        // Check if walletAddress is provided
        if (!walletAddress) {
            return res.status(400).json({ message: 'Wallet address is required' });
        }

        try {
            // Replace with your actual backend server URL
            const backendServerUrl = `http://13.250.122.124:5000/claim-tokens/${walletAddress}`;
            const response = await axios.post(backendServerUrl);

            // Sending the response back to the client
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            if (error.response) {
                res.status(error.response.status).json({ message: error.response.data.message });
            } else {
                res.status(500).json({ message: 'Error claiming tokens' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;
