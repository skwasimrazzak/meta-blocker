import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ImageStorage from './artifacts/contracts/ImageStorage.sol/ImageStorage.json';
// import dotenv from 'dotenv';
// dotenv.config();

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [resultImageUrl, setResultImageUrl] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            // Create a FormData object to prepare the file for upload
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Upload to Pinata (assuming you've set up your API keys correctly)
            const resFile = await axios.post(
                `https://api.pinata.cloud/pinning/pinFileToIPFS`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
                        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
                    },
                }
            );

            const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
            console.log('Image uploaded to IPFS:', ImgHash);

            // Interact with the smart contract
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                'REACT_APP_CONTRACT_ADDRESS',  // Replace with your deployed contract address
                ImageStorage.abi,
                signer
            );

            // Store the IPFS hash on the blockchain
            const tx = await contract.storeImage(ImgHash);
            await tx.wait();

            // Fetch the cleaned image URL
            const cleanedImageUrl = await contract.getCleanedImage();  // Assuming your smart contract has this function

            setResultImageUrl(`https://gateway.pinata.cloud/ipfs/${cleanedImageUrl}`);
        } catch (error) {
            console.error('IPFS upload error:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload Image</button>

            {resultImageUrl && (
                <div>
                    <p>Image uploaded to IPFS:</p>
                    <a href={resultImageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={resultImageUrl} alt="Uploaded" />
                    </a>
                    <a href={resultImageUrl} download="image.png">Download Image</a>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
