async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("wallet").innerText =
      "Connected Wallet: " + address;
  } else {
    alert("Install MetaMask");
  }
}
