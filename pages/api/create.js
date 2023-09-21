import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, description, minPrice, uri, tokenId, signature, cid, studentId, walletAddress } = req.body;

            // Make a POST request to the /api/create endpoint on your server
            const response = await axios.post('http://localhost:4000/api/create', {
                name, description, minPrice, uri, tokenId, signature, cid, studentId, walletAddress
            });

            // Forward the response back to the client
            res.status(201).json(response.data);
        } catch (error) {
            // If there's an error, respond with the appropriate status code and message
            console.error(error);
            if (error.response && error.response.status) {
                res.status(error.response.status).json({ message: error.response.statusText });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
