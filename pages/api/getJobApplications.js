import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { companyId } = req.query;

        // Check if companyId is provided
        if (!companyId) {
            return res.status(400).json({ message: 'Company ID is required' });
        }

        try {
            // Making a request to your local backend server
            const response = await axios.get(`http://localhost:4000/jobApplications?companyId=${companyId}`);
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error retrieving job applications', error);
            if (error.response && error.response.status === 404) {
                res.status(404).json({ message: 'Job applications not found' });
            } else {
                res.status(500).json({ message: 'Error fetching job applications' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
