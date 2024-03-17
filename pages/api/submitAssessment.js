// api/submitAssessment.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formData = req.body;

        try {
            const response = await axios.post('http://13.250.122.124:5000/assessment', formData);
            res.status(201).json({ message: 'Assessment data saved successfully' });
        } catch (error) {
            console.error('Error submitting assessment:', error);
            if (error.response) {
                // Pass the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
