//pages/api/Uregister.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract the necessary fields from the request body
            const { email, password, universityName, FirstName, LastName, cvUrl, CVFreeJobTokenStatus, referredBy } = req.body;

            // Make a POST request to the register endpoint
            const response = await axios.post('http://localhost:4000/Uregister', {
                email,
                password,
                universityName,
                FirstName,
                LastName,
                cvUrl,
                CVFreeJobTokenStatus,
                referredBy
            });

            // Forward the response back to the client
            res.status(201).json({ message: response.data.message || 'User registered successfully' });
        } catch (error) {
            // If there's an error, respond with the appropriate status code and message
            if (error.response) {
                // Forward the backend's response status and message
                const message = error.response.data.message || 'An error occurred';
                res.status(error.response.status).json({ message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
