// pages/api/updateCompanyProfile.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { companyId } = req.query;
        const profile = req.body;
        const token = req.headers.authorization;

        try {
            // Forward the request to your backend service
            const response = await axios.put(`http://localhost:4000/company/updateProfile/${companyId}`, profile, {
                headers: {
                    Authorization: token
                }
            });
            // Send the response back to the frontend
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating company profile:', error);
            if (error.response) {
                // Forward the error response from the backend service
                res.status(error.response.status).json({ message: error.response.data });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
