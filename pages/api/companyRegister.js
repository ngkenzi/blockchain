// pages/api/companyRegister.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Forward the request to your backend service
            const response = await axios.post('http://13.250.122.124:5000/company/register', req.body);
            // Send the response back to the frontend
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error during company registration:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json(error.response.data);
            } else {
                // Handle any other errors
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        // Handle non-POST requests
        res.status(405).json({ message: 'Method not allowed' });
    }
}
