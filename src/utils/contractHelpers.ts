import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import VaultABI from 'config/abi/PublicOffering.json'
import Web3 from 'web3';
import getDomain from './env';


const web3 = new Web3(getDomain());


const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}


export const getVaultContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  // return getContract(VaultABI, address, provider.getSigner());
  return getContract(VaultABI, address, signer)
};

export const getWeb3VaultContract = (address) => {
  const vault = new web3.eth.Contract(VaultABI as any, address);
  return vault;
};

export const getWeb3Erc20Contract = (address) => {
  const vault = new web3.eth.Contract(bep20Abi as any, address);
  return vault;
};