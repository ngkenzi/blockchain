// pages/api/companyRegister.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const formDataToSend = req.body; // assuming formData is already prepared

        try {
            // Forward the request to your backend service
            const response = await axios.post('http://localhost:4000/company/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Send the response back to the frontend
            res.status(201).json({ message: 'Company registered successfully' });
        } catch (error) {
            console.error('Error during company registration:', error);
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
