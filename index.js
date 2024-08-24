import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_execute = document.getElementById("btn_execute");
const btn_getbalance = document.getElementById("btn_getbalance");

btn_connect.onclick = connect;
btn_execute.onclick = execute;
btn_getbalance.onclick = getbalance;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}
async function execute() {
  if (typeof window.ethereum != "undefined") {
    console.log("Executing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.executeFlashLoan('0x29f2D40B0605204364af54EC677bD022dA425d03',100000000);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Execute Finished");
  } else {
    console.log("No metamask!!!");
  }
}
async function getbalance() {
  if (typeof window.ethereum != "undefined") {
    console.log("Getting balance...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.getBalance('0x29f2D40B0605204364af54EC677bD022dA425d03');
    // await listenForTransactionMine(transActionResponse, provider);
    console.log(transActionResponse)
    console.log("Get balance Finished");
  } else {
    console.log("No metamask!!!");
  }
}


function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
