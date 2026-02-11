let provider;
let contract;

const contractAddress = "0xf5e3A22fFC6A30BC83950CF81e890CA42908648F";

const abi = [
  "function userCount() view returns(uint256)",
  "function getUser(address) view returns(uint256,address,uint256,bool)",
  "function checkEarnings(address) view returns(uint256)"
];

window.onload = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  contract = new ethers.Contract(contractAddress, abi, signer);

  loadDashboard();
};

async function loadDashboard() {
  const totalUsers = await contract.userCount();
  document.getElementById("totalUsers").innerText = totalUsers;

  const balance = await provider.getBalance(contractAddress);
  document.getElementById("contractBalance").innerText =
    ethers.utils.formatEther(balance);
}

async function checkUser() {
  const userAddress = document.getElementById("userAddress").value;

  const user = await contract.getUser(userAddress);
  const earnings = await contract.checkEarnings(userAddress);

  document.getElementById("uid").innerText = user[0];
  document.getElementById("referrer").innerText = user[1];
  document.getElementById("earnings").innerText =
    ethers.utils.formatEther(earnings);
}
