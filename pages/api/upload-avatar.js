import axios from 'axios';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const response = await axios.post('http://13.250.122.124:5000/upload-avatar', req, {
                headers: {
                    ...req.headers,
                    host: undefined,
                    cookie: undefined,
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            console.error(error);
            const { response } = error;
            res.status(response?.status || 500).json(response?.data || { error: 'An error occurred while processing your request.' });
        }
    } else {
        res.status(405).end();  // Method Not Allowed
    }
};
