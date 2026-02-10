let provider;
let signer;
let contract;

const contractAddress = "0x613EcF68Cc6d3E34b3Fe836F928055AD4f142200";

const abi = [
  {
    "inputs": [
      { "internalType": "address", "name": "_referrer", "type": "address" }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    await ethereum.request({ method: 'eth_requestAccounts' });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    document.getElementById("wallet").innerHTML =
      "Connected: " + address;

    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert("Install MetaMask!");
  }
}

async function registerUser() {
  if (!contract) {
    alert("Connect wallet first!");
    return;
  }

  try {
    const tx = await contract.register("0x0000000000000000000000000000000000000000");
    await tx.wait();
    alert("User Registered on Blockchain ✅");
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
}
