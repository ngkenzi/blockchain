// pages/api/redeemVoucher.js
import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Extract the voucherCode and walletAddress from the request body
        const { voucherCode, walletAddress, email, fullName } = req.body;

        try {
            // Forward the request to your backend service
            const backendResponse = await axios.post('http://13.250.122.124:5000/redeemVoucher', {
                voucherCode,
                walletAddress,
                email,
                fullName
            });

            // Respond with success message and any additional data from the backend
            res.status(200).json({
                success: true,
                message: 'Voucher redeemed successfully',
                data: backendResponse.data // Pass along the data from the backend response
            });
        } catch (error) {
            console.error('Error redeeming voucher:', error);

            // Check if the error has a response (error response from your backend service)
            if (error.response) {
                // Pass the error response from the backend service
                res.status(error.response.status).json({
                    success: false,
                    message: error.response.data.message
                });
            } else {
                // Handle cases where the error does not come from the backend service
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        }
    } else {
        // Handle any non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
}
