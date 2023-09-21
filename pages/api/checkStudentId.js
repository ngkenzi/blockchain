//checkStudentId.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;
        try {
            const response = await axios.get(`http://localhost:4000/checkStudentId/${id}`);
            res.status(200).json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching details from id' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
