let provider;
let signer;
let contract;
let userAddress;

const contractAddress = "0x624aeF4426b56B4B2799971Dc81D166804F0cD99";

const abi = [
  {
    "inputs":[{"internalType":"address","name":"_referrer","type":"address"}],
    "name":"register",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"","type":"address"}],
    "name":"users",
    "outputs":[
      {"internalType":"address","name":"referrer","type":"address"},
      {"internalType":"bool","name":"registered","type":"bool"}
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("wallet").innerHTML = "Connected: " + userAddress;

    contract = new ethers.Contract(contractAddress, abi, signer);

    // Referral link
    const link = window.location.origin + "/?ref=" + userAddress;
    document.getElementById("reflink").innerHTML = link;

    // Auto fill ref from URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if(ref){
      document.getElementById("ref").value = ref;
    }

  } else {
    alert("Install MetaMask");
  }
}

async function registerUser() {
  const ref = document.getElementById("ref").value;

  try {
    const tx = await contract.register(ref);
    await tx.wait();
    alert("Registered Successfully!");
  } catch (err) {
    alert("Transaction Failed");
  }
}

async function checkUser() {
  const data = await contract.users(userAddress);

  if(data.registered){
    document.getElementById("status").innerHTML =
      "✅ Registered<br>Referrer: " + data.referrer;
  } else {
    document.getElementById("status").innerHTML =
      "❌ Not Registered";
  }
}
