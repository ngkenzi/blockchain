import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract the necessary fields from the request body
            const { email, password, universityName } = req.body;

            // Make a POST request to the register endpoint
            const response = await axios.post('http://localhost:4000/register', {
                email,
                password,
                universityName,
            });

            // Forward the response back to the client
            res.status(201).send('User registered successfully');
        } catch (error) {
            // If there's an error, respond with the appropriate status code and message
            if (error.response && error.response.status === 400) {
                res.status(400).send('Email is already taken');
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
