let provider;
let signer;
let contract;

const contractAddress = "0xbF95259C322c5ec545D53C340d7E208BcC6155B8";

const abi = [
  {
    "inputs":[{"internalType":"address","name":"_referrer","type":"address"}],
    "name":"register",
    "outputs":[],
    "stateMutability":"payable",
    "type":"function"
  }
];

window.addEventListener('load', () => {
  document.getElementById("connectBtn").addEventListener("click", connectWallet);
  document.getElementById("registerBtn").addEventListener("click", registerUser);
});

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
    const tx = await contract.register(ref, {
      const fee = await contract.joinFee();

const tx = await contract.register(ref, {
  value: fee
});

    });

    await tx.wait();
    alert("Registered Successfully!");
  } catch (err) {
    console.error(err);
    alert("Transaction Failed");
  }
}

