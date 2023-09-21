import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { tokenId } = req.query;
        try {
            const response = await axios.get(`http://localhost:4000/getWalletAddress/${tokenId}`);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching wallet address' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
