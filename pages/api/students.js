import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'GET') {
        const { universityName } = req.query;  // Extract university name from the query parameters

        try {
            const response = await axios.get(`http://13.250.122.124:5000/students/${universityName}`);
            res.status(200).json(response.data);  // Send response back to the client
        } catch (error) {
            console.error("Error fetching students:", error);
            res.status(error.response?.status || 500).json(error.response?.data || {});
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });  // Handle methods other than GET
    }
};
