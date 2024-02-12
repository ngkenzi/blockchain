// pages/api/assessments.js
import axios from 'axios';

export default async function handler(req, res) {
    // Ensure we only handle GET requests
    if (req.method === 'GET') {
        try {
            // Make a request to your backend API
            const backendResponse = await axios.get("http://localhost:4000/assessments");

            // Check if we got a successful response
            if (backendResponse.status === 200) {
                // Pass the data from the backend to our Next.js frontend
                res.status(200).json(backendResponse.data);
            } else {
                // Handle any responses that aren't success statuses
                res.status(backendResponse.status).json({ success: false, message: "Error fetching assessments from backend." });
            }
        } catch (error) {
            console.error('Error contacting the backend API:', error);
            // Handle network errors or other issues with the request
            res.status(500).json({ success: false, message: "Internal server error occurred while contacting the backend API." });
        }
    } else {
        // Handle any non-GET requests
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }
}
