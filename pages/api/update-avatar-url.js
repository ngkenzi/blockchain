import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const config = {
                headers: {
                    ...req.headers,
                    host: undefined, // Removing "host" to avoid conflicts
                },
            };

            const response = await axios.post('http://localhost:4000/update-avatar-url', req.body, config);

            res.status(response.status).json(response.data);
        } catch (error) {
            const { response } = error;
            res.status(response?.status || 500).json(response?.data || { error: error.message });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
