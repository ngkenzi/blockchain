import axios from 'axios';
const NFT_STORAGE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDE4OGUwYzhCZjNFZTJlN2IzOGMzRTE5M0M1RDlmOUQ3NjU1NzhFOTYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MTU3Mjg4MTY3OCwibmFtZSI6IlVuaUNlcnQifQ.Zo89YeyQW0XnL15G9-9agkMM9BAda6VDkEoDAvvHFr8";

import { NFTStorage } from 'nft.storage';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const { name, description, studentId, image, ownerType } = req.body;

        // Construct the client
        const client = new NFTStorage({ token: NFT_STORAGE_KEY });

        // Create a Blob from the image (assuming image is sent as a base64 string)
        const imageBuffer = Buffer.from(image.split(',')[1], 'base64');
        const blob = new Blob([imageBuffer], { type: 'image/png' });

        const metadata = await client.store({
            name,
            description,
            studentId,
            ownerType, 
            image: blob,
        });

        res.status(200).json({ url: metadata.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while storing the NFT' });
    }
}
