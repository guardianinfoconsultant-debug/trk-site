let userAddress = "";

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("wallet").innerText =
      "Connected Wallet: " + userAddress;
  } else {
    alert("Install MetaMask");
  }
}

function register() {
  const ref = document.getElementById("ref").value;

  if (!userAddress) {
    alert("Connect wallet first");
    return;
  }

  if (ref === "") {
    alert("Enter referral address");
    return;
  }

  document.getElementById("status").innerText =
    "Registered successfully with referral: " + ref;
}
