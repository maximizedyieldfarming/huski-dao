import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'

// Addresses
import {
  getAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import vaultAbi from 'config/abi/vault.json'
import MultiCallAbi from 'config/abi/Multicall.json'


const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getVaultContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(vaultAbi, address, signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
