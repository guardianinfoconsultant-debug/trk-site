let provider;
let signer;
let contract;

const contractAddress = "0x5bE77c19C693b9A221B725c5ff2b7dB015a0c996";

const abi = [
  "function register(address _referrer) payable",
  "function checkEarnings(address user) view returns(uint)",
  "function withdraw()",
  "function joinFee() view returns(uint)"
];

window.addEventListener('load', () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("registerBtn").onclick = registerUser;
  document.getElementById("earnBtn").onclick = checkEarnings;
  document.getElementById("withdrawBtn").onclick = withdrawEarnings;
});

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  const address = await signer.getAddress();
  document.getElementById("wallet").innerHTML = "Connected: " + address;

  contract = new ethers.Contract(contractAddress, abi, signer);
}

async function registerUser() {
  if (!contract) return alert("Connect wallet first");

  const ref = document.getElementById("ref").value;

  try {
    const fee = await contract.joinFee();

    const tx = await contract.register(ref, { value: fee });
    await tx.wait();

    alert("Registered Successfully!");
  } catch (err) {
    console.error(err);
    alert("Transaction Failed");
  }
}

async function checkEarnings() {
  if (!contract) return alert("Connect wallet first");

  const address = await signer.getAddress();
  const earn = await contract.checkEarnings(address);

  document.getElementById("earnings").innerHTML =
    "Your Earnings: " + ethers.utils.formatEther(earn) + " ETH";
}

async function withdrawEarnings() {
  if (!contract) return alert("Connect wallet first");

  try {
    const tx = await contract.withdraw();
    await tx.wait();

    alert("Withdraw Successful!");
  } catch (err) {
    console.error(err);
    alert("Withdraw Failed");
  }
}
