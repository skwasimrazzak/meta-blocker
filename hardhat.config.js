require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const { PRIVATE_KEY } = process.env;


module.exports = {
    solidity: "0.8.21",
    networks: {
        opencampus: {
            url: `https://rpc.open-campus-codex.gelato.digital/`,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    etherscan: {
        apiKey: "your_etherscan_api_key", // Optional, if you plan to verify contracts
    },
    customChains: [
        {
            network: "opencampus",
            chainId: 656476,
            urls: {
                apiURL: "https://rpc.open-campus-codex.gelato.digital/api",
                browserURL: "https://rpc.open-campus-codex.gelato.digital/",
            },
        },
    ],
};
