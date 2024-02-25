import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await axios.post("http://13.250.122.124:5000/Uconfirm", req.body);
            // Forward the response status and data from your actual server
            return res.status(response.status).json(response.data);
        } catch (error) {
            // Forward error status and message
            return res.status(error.response?.status || 500).json(error.response?.data || {});
        }
    } else {
        // Handle any other HTTP method
        return res.status(405).end(); // 405 Method Not Allowed
    }
}
