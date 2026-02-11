let provider;
let signer;
let contract;

const contractAddress = "0x624aeF4426b56B4B2799971Dc81D166804F0cD99";

const abi = [
  {
    "inputs":[{"internalType":"address","name":"_referrer","type":"address"}],
    "name":"register",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = provider.getSigner();
    const address = await signer.getAddress();

    document.getElementById("wallet").innerHTML = "Connected: " + address;

    contract = new ethers.Contract(contractAddress, abi, signer);

  } else {
    alert("Install MetaMask");
  }
}

async function registerUser() {

  if (!contract) {
    alert("Connect wallet first");
    return;
  }

  const ref = document.getElementById("ref").value;

  try {
    const tx = await contract.register(ref);
    await tx.wait();
    alert("Registered Successfully!");
  } catch (err) {
    console.error(err);
    alert("Transaction Failed");
  }
}
