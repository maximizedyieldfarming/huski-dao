import { ethers } from 'ethers'
import Web3 from 'web3'
import FairLaunchABI from 'config/abi/fairLaunch.json'
import HuskyTokenABI from 'config/abi/huskyToken.json'
import MasterChefABI from 'config/abi/pancakeMasterChef.json'
import PancakePairABI from 'config/abi/pancakePair.json'
import VaultABI from 'config/abi/vault.json'
import getDomain, { getFairLaunch, getHusky, getPancakeMasterChef } from './env'

const minABI = [
    {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
    },
];

const web3 = new Web3(getDomain());
const provider = new ethers.providers.Web3Provider(window.ethereum);
const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getDomain());

export const fromWei = async (amount) => {
    return web3.utils.fromWei(amount, 'ether');
};

export const getWalletBnbBalance = async (address) => {
    const rawBalance = await web3.eth.getBalance(address);
    const balance = parseFloat(web3.utils.fromWei(rawBalance, 'ether')).toFixed(8);
    return balance;
};

export const getWalletTokenBalance = async (walletAddress, tokenAddress) => {
    const contract = new web3.eth.Contract(minABI as any, tokenAddress);
    const rawBalance = await contract.methods.balanceOf(walletAddress).call();
    const balance = parseFloat(web3.utils.fromWei(rawBalance, 'ether')).toFixed(8);
    return balance;
};

// const getContract = (abi, address, signer) => {
//     const signerOrProvider = signer || simpleRpcProvider;
//     return new ethers.Contract(address, abi, signerOrProvider);
// };

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
  }

// export const getWeb3Contract = (address) => {
//   const contract = new web3.eth.Contract(PancakePairABI, address);
//   return contract;
// };

export const getFairLaunchContract = () => {
    return getContract(FairLaunchABI, getFairLaunch(), provider.getSigner());
};

export const getWeb3FairLaunchContract = () => {
    const fairLaunch = new web3.eth.Contract(FairLaunchABI as any, getFairLaunch());
    return fairLaunch;
};

export const getHuskyTokenContract = () => {
    return getContract(HuskyTokenABI, getHusky(), provider.getSigner());
};

export const getWeb3HuskyTokenContract = () => {
    const huskyToken = new web3.eth.Contract(HuskyTokenABI as any, getHusky());
    return huskyToken;
};

export const getMasterChefContract = () => {
    return getContract(MasterChefABI, getPancakeMasterChef(), provider.getSigner());
};

export const getWeb3MasterChefContract = () => {
    const masterChef = new web3.eth.Contract(MasterChefABI as any, getPancakeMasterChef());
    return masterChef;
};

export const getPancakePairContract = (address) => {
    return getContract(PancakePairABI, address, provider.getSigner());
};

export const getWeb3PancakePairContract = (address) => {
    const lpToken = new web3.eth.Contract(PancakePairABI as any, address);
    return lpToken;
};

export const getVaultContract = (address) => {
    return getContract(VaultABI, address, provider.getSigner());
};

export const getWeb3VaultContract = (address) => {
    const vault = new web3.eth.Contract(VaultABI as any, address);
    return vault;
};
