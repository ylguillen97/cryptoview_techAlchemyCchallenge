const Web3 = require("web3").default;
const NFT = require("../models/nftModel");
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(process.env.ETH_MAINNET_RPC_URL);

const nftAbi = [
  {
    constant: true,
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];

const getNFTMetadata = async (req, res) => {
  const { contractAddress, tokenId } = req.body;

  try {
    let nft = await NFT.findOne({ contractAddress, tokenId });
    if (nft) {
      return res.status(200).json(nft);
    }

    const contract = new web3.eth.Contract(nftAbi, contractAddress);
    let tokenURI = await contract.methods.tokenURI(tokenId).call();

    if (tokenURI.startsWith("ipfs://")) {
      tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    if (!tokenURI.startsWith("http://") && !tokenURI.startsWith("https://")) {
      return res.status(400).json({ error: "Token URI has an unknown scheme" });
    }

    const response = await fetch(tokenURI);
    const metadata = await response.json();

    nft = new NFT({
      contractAddress,
      tokenId,
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
    });
    await nft.save();

    res.status(200).json(nft);
  } catch (error) {
    console.error("Error retrieving NFT metadata:", error);
    res.status(500).json({ error: "Failed to retrieve NFT metadata" });
  }
};

module.exports = { getNFTMetadata };
