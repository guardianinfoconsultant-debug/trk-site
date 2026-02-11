<!DOCTYPE html>
<html>
<head>
    <title>TRK DApp</title>
    <script src="https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js"></script>
    <style>
        body{font-family:Arial;background:#111;color:#fff;text-align:center}
        button{padding:10px 20px;margin:5px;font-size:16px}
        input{padding:8px;width:320px}
        .box{border:1px solid #444;padding:15px;margin:15px}
    </style>
</head>
<body>

<h2>TRK Smart Contract DApp</h2>

<button onclick="connectWallet()">Connect Wallet</button>
<p id="wallet"></p>

<div class="box">
    <h3>Your Referral Link</h3>
    <p id="refLink"></p>
</div>

<div class="box">
    <input id="ref" placeholder="Referrer address">
    <br><br>
    <button onclick="register()">Register</button>
</div>

<div class="box">
    <h3>User Info</h3>
    <p>User ID: <span id="uid">0</span></p>
    <p>Earnings: <span id="earn">0</span> BNB</p>
    <button onclick="withdraw()">Withdraw</button>
</div>

<div class="box">
    <button onclick="totalUsers()">Total Users</button>
    <p id="tusers"></p>
</div>

<div class="box">
    <button onclick="contractBalance()">Contract Balance</button>
    <p id="cbal"></p>
</div>

<script>
let provider, signer, contract;

const contractAddress = "0xD19FF9d99D2e2B6Fec385d6276e93e4DceCc63dA";

const abi = [
 "function register(address _referrer) payable",
 "function joinFee() view returns(uint256)",
 "function getUser(address) view returns(uint256,address,uint256,bool)",
 "function checkEarnings(address) view returns(uint256)",
 "function withdraw()",
 "function userCount() view returns(uint256)"
];

function getRef(){
  const url = new URLSearchParams(window.location.search);
  return url.get("ref");
}

async function connectWallet(){
    if(!window.ethereum){ alert("Install MetaMask"); return; }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const addr = await signer.getAddress();

    document.getElementById("wallet").innerText = "Connected: " + addr;

    contract = new ethers.Contract(contractAddress, abi, signer);

    document.getElementById("refLink").innerText =
      window.location.origin + "?ref=" + addr;

    const urlRef = getRef();
    if(urlRef) document.getElementById("ref").value = urlRef;

    loadUser(addr);
    setInterval(()=>loadUser(addr),5000);
}

async function register(){
    const ref = document.getElementById("ref").value;
    const fee = await contract.joinFee();
    const tx = await contract.register(ref,{value:fee});
    await tx.wait();
    alert("Registered");
}

async function loadUser(addr){
    try{
        const u = await contract.getUser(addr);
        const e = await contract.checkEarnings(addr);
        document.getElementById("uid").innerText = u[0];
        document.getElementById("earn").innerText =
          ethers.utils.formatEther(e);
    }catch{}
}

async function withdraw(){
    const tx = await contract.withdraw();
    await tx.wait();
    alert("Withdraw Done");
}

async function totalUsers(){
    const c = await contract.userCount();
    document.getElementById("tusers").innerText = c;
}

async function contractBalance(){
    const b = await provider.getBalance(contractAddress);
    document.getElementById("cbal").innerText =
      ethers.utils.formatEther(b);
}
</script>

</body>
</html>
