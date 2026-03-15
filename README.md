# Meta Blocker

> Keep yourself anonymous while sharing content on the internet.

**Meta Blocker** is a decentralized application (dApp) that strips metadata from images before sharing them. When you upload an image, it gets pinned to IPFS via Pinata, which inherently drops all embedded EXIF data (GPS location, device model, timestamps, software info). The resulting IPFS content hash is then stored on the **EDU Chain (Open Campus Codex)** blockchain as a tamper-proof, verifiable pointer to your clean file.

Built for the **EDU Chain Hackathon**.

Live demo: [meta-blocker.vercel.app](https://meta-blocker.vercel.app)

---

## Why This Matters

Every image taken on a smartphone or camera embeds metadata (EXIF data) that can expose:

- Precise GPS coordinates of where the photo was taken
- Device model and manufacturer
- Date and time of capture
- Software and OS version used

This is a real privacy vulnerability. Journalists, activists, whistleblowers, and everyday users have been deanonymized through this exact vector. Meta Blocker removes that risk by routing your image through IPFS, which stores only the raw binary, discarding all metadata in the process.

---

## How It Works

```
User uploads image
       |
       v
Pinata API pins file to IPFS
(EXIF metadata is stripped implicitly)
       |
       v
IPFS returns a content hash (CID)
       |
       v
MetaMask signs a transaction
       |
       v
setImageHash(CID) stored on EDU Chain
       |
       v
getImageHash() retrieves the clean IPFS URL
       |
       v
User views and downloads the clean image
```

---

## Screenshots

| Before Upload | After Submit | Result and Download |
|---|---|---|
| ![Before Upload](img%20asset/MetaBlocker_1.png) | ![After Submit](img%20asset/MetaBlocker_2.png) | ![Result](img%20asset/MetaBlocker_3.png) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, CRA, Axios |
| Styling | Custom CSS (glassmorphism, CSS keyframes) |
| Blockchain | Solidity 0.8.21, Hardhat, Ethers.js |
| Network | EDU Chain - Open Campus Codex (Chain ID: 656476) |
| Storage | IPFS via Pinata |
| Deployment | Vercel |
| Wallet | MetaMask |

---

## Key Technical Aspects

**IPFS as an implicit metadata sanitizer**
No server-side processing pipeline, no dedicated EXIF-stripping library. Pinata/IPFS stores only the raw binary of the file, meaning all embedded metadata is dropped by the nature of how IPFS handles content.

**On-chain content addressing**
The IPFS CID is stored on EDU Chain via a Solidity smart contract. This creates a publicly verifiable, immutable record of the clean file reference. Anyone can verify the hash on-chain.

**Fully client-side architecture**
No backend server at all. The entire stack is MetaMask (wallet/signer) + Pinata API (IPFS pinning) + React (UI). Minimal attack surface.

**EDU Chain integration**
Deployed on Open Campus Codex, an EVM-compatible L2 built for the education ecosystem. Uses Gelato's RPC (`https://rpc.open-campus-codex.gelato.digital/`).

**Deployed contract**
```
ImageStorage deployed at: 0x7dD20bf5793a92d07295C1e8995C8783AE953FaB
Network: Open Campus Codex (Chain ID: 656476)
```

---

## Frontend Details

- Built with **React 18** and bootstrapped via Create React App
- Single-component architecture centered around `ImageUploader.js`
- **Glassmorphism UI**: dark background (`#011317`), frosted glass cards using `backdrop-filter: blur`, subtle `rgba` borders
- **Animated sparkle particles**: JS-generated DOM elements with randomized positions and CSS keyframe animations, giving a live ambient effect
- **Custom pill button**: white blur-circle hover animation using CSS nested selectors and `filter: blur`
- **Google Fonts**: Poppins (400, 300, italic)
- **Responsive grid layout** using CSS `place-items: center`

---

## Setup

### Prerequisites

- Node.js v16+
- MetaMask browser extension
- A free [Pinata](https://pinata.cloud) account
- EDU Chain (Open Campus Codex) added to MetaMask and some test EDU tokens

**Adding Open Campus Codex to MetaMask:**

| Field | Value |
|---|---|
| Network Name | Open Campus Codex |
| RPC URL | https://rpc.open-campus-codex.gelato.digital/ |
| Chain ID | 656476 |
| Currency Symbol | EDU |

---

### 1. Clone the repo

```bash
git clone https://github.com/skwasimrazzak/meta-blocker.git
cd meta-blocker
```

### 2. Install root dependencies (Hardhat)

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd meta-blocker
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `meta-blocker/` folder:

```env
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_API_KEY=your_pinata_secret_api_key
REACT_APP_CONTRACT_ADDRESS=0x7dD20bf5793a92d07295C1e8995C8783AE953FaB
```

Get your Pinata keys from: [app.pinata.cloud/keys](https://app.pinata.cloud/keys)

The contract is already deployed. You can use the address above directly.

### 5. Run the app

```bash
npm start
```

App runs at `http://localhost:3000`

---

### Optional: Deploy your own contract

If you want to redeploy the contract to your own wallet:

Create a `.env` file at the **root** of the project:

```env
PRIVATE_KEY=your_wallet_private_key
```

Then run:

```bash
npx hardhat run scripts/deploy.js --network opencampus
```

Update `REACT_APP_CONTRACT_ADDRESS` in your frontend `.env` with the new address.

---

## Project Structure

```
meta-blocker/
├── contracts/
│   └── ImageStorage.sol        # Solidity smart contract
├── scripts/
│   └── deploy.js               # Hardhat deployment script
├── hardhat.config.js           # Hardhat + EDU Chain network config
├── meta-blocker/               # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── ImageUploader.js    # Core component (upload, IPFS, contract)
│   │   └── artifacts/          # Compiled contract ABI
│   └── package.json
└── img asset/                  # App screenshots
```

---

## Scope of Improvement and Contributing

This project was built as a hackathon prototype. There is plenty of room to grow it into something more robust. Contributions are welcome.

**Known Limitations**

- The smart contract stores a single global hash with no per-user mapping. Any new upload overwrites the previous one for all users.
- Pinata is a centralized API. For a true privacy tool, a decentralized pinning solution (like web3.storage or a self-hosted IPFS node) would be stronger.
- No client-side metadata preview before upload (user can't see what EXIF data they're stripping).
- No file type validation or size limit enforcement.

**Good First Issues**

- Add per-user hash mapping in the smart contract (`mapping(address => string)`)
- Show a preview of the detected EXIF metadata before upload using a library like `exifr`
- Add file type validation (accept only images)
- Add loading state and error handling UI
- Write unit tests for the smart contract using Hardhat/Chai

**Larger Contributions**

- Replace Pinata with `web3.storage` or `nft.storage` for fully decentralized pinning
- Add support for bulk image upload and batch processing
- Build a history view showing past uploads tied to the connected wallet
- Add contract events (`ImageStored(address indexed user, string hash)`) and index them for a proper activity feed
- Mobile-responsive redesign
- Support for other file types (PDF, video) with similar metadata stripping

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please open an issue first for any significant changes so we can discuss the approach before you invest time building it.

---
 
## License
 
MIT License. See [LICENSE](LICENSE) for details.
 
