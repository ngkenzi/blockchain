import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract data from the request body
            const { wallet_address } = req.body;

            // Make a POST request to the actual updateStudentJobTokens endpoint
            const backendResponse = await axios.post('http://localhost:4000/updateStudentJobTokens', {
                wallet_address
            });

            // Forward the response from the backend to the client
            res.status(200).json(backendResponse.data);
        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error in /api/updateStudentJobTokens:', error);
            if (error.response) {
                // Forward the backend's response if available
                res.status(error.response.status).json(error.response.data);
            } else {
                // Generic server error response
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        // Method not allowed
        res.status(405).json({ message: 'Method not allowed' });
    }
}
