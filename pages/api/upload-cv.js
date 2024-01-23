// pages/api/upload-cv.js
import axios from 'axios';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            // Read the entire request body as a buffer
            const data = await new Promise((resolve, reject) => {
                const chunks = [];
                req.on('data', (chunk) => chunks.push(chunk));
                req.on('end', () => resolve(Buffer.concat(chunks)));
                req.on('error', reject);
            });

            // Forward the buffer to your backend server
            const response = await axios({
                method: 'post',
                url: 'http://localhost:4000/upload-cv',
                data: data,
                headers: {
                    ...req.headers,
                    host: undefined,
                    cookie: undefined,
                    'content-length': req.headers['content-length'],
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            console.error('Error forwarding request:', error);
            if (error.response) {
                res.status(error.response.status).json({ message: error.response.data.message, success: false });
            } else {
                res.status(500).json({ message: 'Internal server error', success: false });
            }
        }
    } else {
        res.status(405).end();
    }
};
