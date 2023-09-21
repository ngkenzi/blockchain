import axios from 'axios';

export default async (req, res) => {
    if (req.method === 'DELETE') {
        const { cid } = req.query;

        if (!cid) {
            return res.status(400).json({ error: 'CID is required.' });
        }

        try {
            const response = await axios.delete(`http://localhost:4000/deleteItemFromCid/${cid}`);

            if (response.status === 200) {
                res.status(200).json({ message: 'Item deleted successfully!' });
            } else {
                res.status(response.status).json({ error: 'Failed to delete the item.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while deleting the item.' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
};
