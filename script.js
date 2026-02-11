let provider, signer, contract;

const contractAddress = "0xD19FF9d99D2e2B6Fec385d6276e93e4DceCc63dA";

const abi = [
  "function register(address _referrer) payable",
  "function getUser(address) view returns(uint,address,uint,uint,uint,uint,uint)",
  "function withdraw()"
];

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert("Install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  const address = await signer.getAddress();

  document.getElementById("wallet").innerText = "Connected: " + address;

  contract = new ethers.Contract(contractAddress, abi, signer);

  loadUserData(address);
}

async function registerUser() {
  const ref = document.getElementById("ref").value;

  try {
    const tx = await contract.register(ref, {
      value: ethers.utils.parseEther("0.01")
    });
    await tx.wait();
    alert("Registration Successful");
  } catch (err) {
    console.error(err);
    alert("Transaction Failed");
  }
}

async function loadUserData(address) {
  try {
    const u = await contract.getUser(address);

    document.getElementById("uid").innerText = u[0];
    document.getElementById("partners").innerText = u[2];
    document.getElementById("l1").innerText = ethers.utils.formatEther(u[3]);
    document.getElementById("l2").innerText = ethers.utils.formatEther(u[4]);
    document.getElementById("l3").innerText = ethers.utils.formatEther(u[5]);
    document.getElementById("total").innerText = ethers.utils.formatEther(u[6]);

  } catch (e) {
    console.log("User not registered yet");
  }
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
