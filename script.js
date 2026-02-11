let provider;
let signer;
let contract;

const contractAddress = "0xf5e3A22fFC6A30BC83950CF81e890CA42908648F";

const abi = [
  "function register(address _referrer) payable",
  "function getUser(address) view returns(uint,address,uint,bool)",
  "function checkEarnings(address) view returns(uint)",
  "function withdraw()",
  "function userCountView() view returns(uint)",
  "function joinFee() view returns(uint256)"
];

function getRefFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

window.addEventListener('load', () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("registerBtn").onclick = registerUser;
  document.getElementById("withdrawBtn").onclick = withdrawEarnings;
  document.getElementById("totalUsersBtn").onclick = getTotalUsers;

  const urlRef = getRefFromURL();
  if (urlRef) {
    document.getElementById("ref").value = urlRef;
  }
});

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const address = await signer.getAddress();

  document.getElementById("wallet").innerHTML = "Connected: " + address;

  contract = new ethers.Contract(contractAddress, abi, signer);

  const myRefLink = window.location.origin + "/?ref=" + address;
  document.getElementById("refBox").innerHTML =
    "Your Referral Link:<br>" + myRefLink;

  loadUserData(address);
  setInterval(() => loadUserData(address), 5000);
}

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

async function loadUserData(address) {
  try {
    const user = await contract.getUser(address);
    const earnings = await contract.checkEarnings(address);

    document.getElementById("uid").innerText = user[0];
    document.getElementById("earn").innerText =
      ethers.utils.formatEther(earnings);
  } catch (e) {}
}

async function withdrawEarnings() {
  try {
    const tx = await contract.withdraw();
    await tx.wait();
    alert("Withdraw Successful");
  } catch {
    alert("Withdraw Failed");
  }
}

async function getTotalUsers() {
  const count = await contract.userCountView();
  document.getElementById("tusers").innerText = count;
}
