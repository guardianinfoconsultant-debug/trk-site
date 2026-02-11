let provider, signer, contract;

const address = "0xf5e3A22fFC6A30BC83950CF81e890CA42908648F";

const abi = [
 "function getUser(address) view returns(uint,address,uint,bool)",
 "function checkEarnings(address) view returns(uint)",
 "function userCountView() view returns(uint)",
 "function idToAddress(uint) view returns(address)"
];

async function connect(){
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts",[]);
  signer = provider.getSigner();
  adminWallet.innerText = await signer.getAddress();
  contract = new ethers.Contract(address,abi,signer);
}

async function getStats(){
  users.innerText = await contract.userCountView();
  balance.innerText = ethers.utils.formatEther(
    await provider.getBalance(address)
  );
}

async function checkUser(){
  const u = await contract.getUser(checkAddr.value);
  const e = await contract.checkEarnings(checkAddr.value);
  uid.innerText = u[0];
  ref.innerText = u[1];
  earn.innerText = ethers.utils.formatEther(e);
}
