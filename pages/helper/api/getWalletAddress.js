import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { tokenId } = req.query;
        try {
            console.log("TOKEN TOKEN,", tokenId)
            const response = await axios.get(`http://13.250.122.124:5000/getWalletAddress/${tokenId}`);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching wallet address' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
