let provider;
let signer;
let contract;

const contractAddress = "0x5bE77c19C693b9A221B725c5ff2b7dB015a0c996";

const abi = [
  "function register(address _referrer) payable",
  "function withdraw()",
  "function checkEarnings(address user) view returns(uint256)",
  "function getUser(address user) view returns(uint256,address,uint256)",
  "function joinFee() view returns(uint256)"
];

async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    document.getElementById("wallet").innerHTML = "Connected: " + address;

    contract = new ethers.Contract(contractAddress, abi, signer);

    loadUserData(address);
  }
}

async function registerUser() {
  const ref = document.getElementById("ref").value;

  const fee = await contract.joinFee();

  const tx = await contract.register(ref, { value: fee });
  await tx.wait();

  alert("Registered!");
  connectWallet();
}

async function loadUserData(address) {
  try {
    const user = await contract.getUser(address);

    if (user[0].toString() !== "0") {
      document.getElementById("userid").innerHTML = "User ID: " + user[0];

      const earn = await contract.checkEarnings(address);
      document.getElementById("earnings").innerHTML =
        "Earnings: " + ethers.utils.formatEther(earn) + " ETH";

      document.getElementById("refLink").innerHTML =
        "Referral: https://trk-site.vercel.app/?ref=" + address;
    }
  } catch (e) {
    console.log(e);
  }
}

async function withdrawMoney() {
  const tx = await contract.withdraw();
  await tx.wait();
  alert("Withdraw Successful");
  connectWallet();
}
