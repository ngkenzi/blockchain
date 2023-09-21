import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract the necessary fields from the request body
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // Make a POST request to the loginAdmin endpoint
            const response = await axios.post('http://localhost:4000/loginAdmin', {
                email,
                password,
            });

            // Forward the response back to the client
            res.status(200).json(response.data);
        } catch (error) {
            // If there's an error, respond with the appropriate status code and message
            const statusCode = error.response ? error.response.status : 500;
            const message = error.response ? error.response.data : 'Internal server error';
            return res.status(statusCode).send(message);
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
