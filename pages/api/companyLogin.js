// pages/api/companyLogin.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formData = req.body;

        try {
            // Forward the request to your backend service
            const response = await axios.post('http://13.250.122.124:5000/company/login', formData);
            // Send the response back to the frontend
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error during company login:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
