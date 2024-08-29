import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import ImageStorage from './artifacts/contracts/ImageStorage.sol/ImageStorage.json';
import { Web3Provider } from '@ethersproject/providers';
import './App.css';
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

            const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
            console.log('Image uploaded to IPFS:', ImgHash);

            if (!window.ethereum) {
                alert('MetaMask is not installed. Please install it to use this feature.');
                return;
            }
            console.log('window.ethereum:', window.ethereum);

            // Interact with the smart contract
            const provider = new Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(
                process.env.REACT_APP_CONTRACT_ADDRESS, // Replace with your deployed contract address
                ImageStorage.abi,
                signer
            );

            
            // Store the IPFS hash on the blockchain
            // const tx = await contract.storeImage(ImgHash);
            const tx = await contract.setImageHash(ImgHash);
            console.log('Transaction sent:', tx);
            // const receipt = await tx.wait();
            // console.log('Transaction receipt:', receipt);

            // if (receipt.confirmations !== undefined) {
            //     console.log('Confirmations:', receipt.confirmations);
            //   } else {
            //     console.log('Confirmations not available');
            //   }
            // Fetch the cleaned image URL
            // const cleanedImageUrl = await contract.getCleanedImage();  // Assuming your smart contract has this function
            const cleanedImageUrl = await contract.getImageHash();
            setResultImageUrl(`${cleanedImageUrl}`);
            console.log(`https://gateway.pinata.cloud/ipfs/${cleanedImageUrl}`)
        } catch (error) {
            console.error('IPFS upload error:', error);
        }

    };

    const handleDownload = (url) => {
        if (url) {
            console.log('Image URL:', url);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'image.png'; // Set the desired file name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        const createRandomSparkle = () => {
            const sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");

            const randomX = Math.random() * window.innerWidth;
            const randomY = Math.random() * window.innerHeight;

            sparkle.style.left = `${randomX}px`;
            sparkle.style.top = `${randomY}px`;

            const randomXDirection = (Math.random() - 0.5) * 10;
            const randomYDirection = (Math.random() - 0.5) * 10;

            sparkle.style.setProperty("--randomXDirection", randomXDirection);
            sparkle.style.setProperty("--randomYDirection", randomYDirection);

            document.body.appendChild(sparkle);

            sparkle.style.animation = `sparkleAnimation 10s linear`;
            sparkle.style.animationDirection = randomXDirection > 0 ? "normal" : "reverse";

            setTimeout(() => {
                sparkle.remove();
            }, 10000);
        };

        const sparkleInterval = setInterval(createRandomSparkle, 1000);

        return () => clearInterval(sparkleInterval); // Cleanup on unmount
    }, []);

    return (
        <div class="mainDiv">
            <input type="file" onChange={handleFileChange} />
        
            {/* <button onClick={handleUpload}>Upload Image</button> */}
            <button class="btn" onClick={handleUpload}>
                <div class="bg-container">
                     <div class="bg-circle"></div>
                </div>
                <div class="front">
                    <span>Submit</span>
                </div>
            </button>

            {resultImageUrl && (
                <div>
                    <p>Processed Image:</p>
                    <a href={resultImageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={resultImageUrl} alt=".img" />
                    </a>
                    {/* <button onClick={() => handleDownload(resultImageUrl)}>Download Image</button> */}
                    <button class="btn" onClick={() => handleDownload(resultImageUrl)}>
                        <div class="bg-container">
                            <div class="bg-circle"></div>
                        </div>
                        <div class="front">
                             <span>Download</span>
                        </div>
                     </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
