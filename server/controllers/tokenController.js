const Web3 = require("web3").default;
const dotenv = require("dotenv");
dotenv.config();

const web3 = new Web3(process.env.ETH_MAINNET_RPC_URL);

const tokenAbi = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

const getTokenBalance = async (req, res) => {
  const { tokenAddress, walletAddress } = req.body;

  try {
    const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);

    const balance = BigInt(
      await tokenContract.methods.balanceOf(walletAddress).call()
    );
    const decimals = await tokenContract.methods.decimals().call();

    const divisor = BigInt(10) ** BigInt(decimals);
    const formattedBalance = Number(balance) / Number(divisor);

    res.status(200).json({ balance: formattedBalance });
  } catch (error) {
    console.error("Error retrieving token balance:", error);
    res.status(500).json({ error: "Failed to retrieve token balance" });
  }
};

module.exports = { getTokenBalance };
