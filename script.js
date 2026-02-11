let provider, signer, contract;

const contractAddress = "0x5bE77c19C693b9A221B725c5ff2b7dB015a0c996";

const abi = [
  "function register(address _referrer) payable",
  "function joinFee() view returns(uint256)",
  "function getUser(address) view returns(uint256,address,uint256,bool)",
  "function checkEarnings(address) view returns(uint256)",
  "function withdraw()",
  "function userCount() view returns(uint256)",
  "function idToAddress(uint256) view returns(address)"
];

function getRef() {
  const url = new URLSearchParams(window.location.search);
  return url.get("ref");
}

window.onload = () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("registerBtn").onclick = registerUser;
  document.getElementById("withdrawBtn").onclick = withdraw;
  document.getElementById("totalUsersBtn").onclick = totalUsers;
  document.getElementById("contractBalBtn").onclick = balance;
  document.getElementById("findUserBtn").onclick = findWallet;

  const r = getRef();
  if(r) document.getElementById("ref").value = r;
};

async function connectWallet(){
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, abi, signer);

  const addr = await signer.getAddress();
  document.getElementById("wallet").innerText = addr;

  document.getElementById("refBox").innerHTML =
    `Your Link:<br>${location.origin}/?ref=${addr}`;

  load(addr);
  setInterval(()=>load(addr),4000);
}

async function registerUser(){
  const ref = document.getElementById("ref").value;
  const fee = await contract.joinFee();
  const tx = await contract.register(ref,{value:fee});
  await tx.wait();
  alert("Registered");
}

async function load(a){
  const u = await contract.getUser(a);
  const e = await contract.checkEarnings(a);
  document.getElementById("uid").innerText = u[0];
  document.getElementById("earn").innerText =
    ethers.utils.formatEther(e);
}

async function withdraw(){
  await contract.withdraw();
  alert("Withdraw Done");
}

async function totalUsers(){
  const c = await contract.userCount();
  document.getElementById("tusers").innerText = c;
}

async function balance(){
  const b = await provider.getBalance(contractAddress);
  document.getElementById("cbal").innerText =
    ethers.utils.formatEther(b);
}

async function findWallet(){
  const id = document.getElementById("uidInput").value;
  if(!id){
    alert("Enter ID");
    return;
  }
  const addr = await contract.idToAddress(id);
  document.getElementById("foundWallet").innerText = addr;
}
