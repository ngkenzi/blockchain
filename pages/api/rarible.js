import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({ message: 'Address query parameter is required' });
        }

        try {
            const response = await axios.get(`https://api.rarible.org/v0.1/items/byOwner?owner=ETHEREUM:${address}`, {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "d94d0879-f919-4803-b293-11ea277a2982",
                },
            });

            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching NFTs' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
