let provider;
let signer;
let contract;

const contractAddress = "0xD19FF9d99D2e2B6Fec385d6276e93e4DceCc63dA";

const abi = [
  "function register(address _referrer) payable",
  "function joinFee() view returns(uint256)",
  "function getUser(address) view returns(uint256,address,uint256,bool)",
  "function checkEarnings(address) view returns(uint256)",
  "function withdraw()",
  "function userCount() view returns(uint256)",
  "function idToAddress(uint256) view returns(address)"
];

// ✅ Referral from URL
function getRefFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

window.addEventListener('load', () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("registerBtn").onclick = registerUser;
  document.getElementById("withdrawBtn").onclick = withdrawEarnings;
  document.getElementById("totalUsersBtn").onclick = getTotalUsers;
  document.getElementById("contractBalBtn").onclick = getContractBalance;

  const urlRef = getRefFromURL();
  if (urlRef) {
    document.getElementById("ref").value = urlRef;
  }
});

// ✅ Connect Wallet
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

  // Referral link show
  const myRefLink = window.location.origin + "/?ref=" + address;
  document.getElementById("refBox").innerHTML =
    "Your Referral Link:<br>" + myRefLink;

  loadUserData(address);
  setInterval(() => loadUserData(address), 5000);
}

// ✅ Register
async function registerUser() {
  if (!contract) {
    alert("Connect wallet first");
    return;
  }

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

// ✅ Load user data
async function loadUserData(address) {
  try {
    const user = await contract.getUser(address);
    const earnings = await contract.checkEarnings(address);

    document.getElementById("uid").innerText = user[0];
    document.getElementById("earn").innerText =
      ethers.utils.formatEther(earnings);
  } catch (e) {}
}

// ✅ Withdraw
async function withdrawEarnings() {
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    alert("Withdraw Successful");
  } catch {
    alert("Withdraw Failed");
  }
}

// ✅ Total users
async function getTotalUsers() {
  const count = await contract.userCount();
  document.getElementById("tusers").innerText = count;
}

// ✅ Contract balance
async function getContractBalance() {
  const bal = await provider.getBalance(contractAddress);
  document.getElementById("cbal").innerText =
    ethers.utils.formatEther(bal);
}
