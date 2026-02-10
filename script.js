const contractAddress = "0xbF95259C322c5ec545D53C340d7E208BcC6155B8";

const abi = [PASTE_YOUR_ABI_HERE];

let provider;
let signer;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();

    const address = await signer.getAddress();
    document.getElementById("wallet").innerText = "Connected: " + address;

    contract = new ethers.Contract(contractAddress, abi, signer);
  } else {
    alert("Install MetaMask");
  }
}

async function registerUser() {
  const ref = document.getElementById("ref").value;

  const fee = await contract.joinFee();

  const tx = await contract.register(ref, {
    value: fee
  });

  await tx.wait();
  alert("Registered Successfully on Blockchain!");
}
