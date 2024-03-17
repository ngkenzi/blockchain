// api/getNFTDetailsById.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { tokenId } = req.query;

        // Check if tokenId is provided
        if (!tokenId) {
            return res.status(400).json({ message: 'Token ID is required' });
        }

        try {
            const response = await axios.get(`http://13.250.122.124:5000/getNFTByTokenId?tokenId=${tokenId}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 404) {
                res.status(404).json({ message: 'NFT not found' });
            } else {
                res.status(500).json({ message: 'Error fetching NFT details' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
