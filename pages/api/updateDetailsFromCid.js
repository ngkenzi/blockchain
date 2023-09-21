import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { cid } = req.query;
        try {
            const response = await axios.get(`http://localhost:4000/updateDetailsFromCid/${cid}`);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error updating details from CID' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}