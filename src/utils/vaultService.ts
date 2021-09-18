/* eslint-disable no-restricted-properties */
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import { getVaultContract, getWeb3VaultContract } from './contractHelper';
import { BLOCKS_PER_YEAR, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from './config';
import getDomain, { getFairLaunch } from './env'; // Between 90% and 100%

const mathematics1 = 0.4; // Less than 50% utilization
const mathematics2 = 0; // Between 50% and 90%
const mathematics3 = 13;

const web3 = new Web3(getDomain());

export async function getBalanceOf(param: any) {
  const vault = getWeb3VaultContract(param.address); // new web3.eth.Contract(VaultABI, param.address);
  const balance = await vault.methods.balanceOf(param.userAddress).call();
  return balance;
}

export async function getSumLendData(param: any) {
  const vault = getWeb3VaultContract(param.address); // new web3.eth.Contract(VaultABI, param.address);
  const totalToken = parseInt(await vault.methods.totalToken().call());
  return totalToken;
}

export async function getLandRate(param: any) {
  const vault = getWeb3VaultContract(param.vaultAddress); // new web3.eth.Contract(VaultABI, param.address);

  const totalToken = parseInt(await vault.methods.totalToken().call());
  const vaultDebtVal = parseInt(await vault.methods.vaultDebtVal().call());
  const utilization = totalToken > 0 ? vaultDebtVal / totalToken : 0;

  let landRate = 0;
  // Interest=m∗utilization+b
  if (utilization < 0.5) {
    landRate = mathematics1 * utilization;
  } else if (utilization > 0.9) {
    landRate = mathematics3 * utilization - 11.5;
  } else {
    landRate = mathematics2 * utilization + 0.2;
  }

  return landRate;
}

export async function getStakeApr(param: any) {
  const vault = getWeb3VaultContract(param.address); // new web3.eth.Contract(VaultABI, param.address);

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());

  const stakeApr = BLOCKS_PER_YEAR.times(param.husky * param.huskyPrice).div(
    (param.baseTokenPrice * totalToken * totalToken) / totalSupply
  );

  return stakeApr.toNumber();
}

export async function getStakeValue(param: any) {
  const vault = getWeb3VaultContract(param.address); // new web3.eth.Contract(VaultABI, param.address);
  const name = await vault.methods.name().call();

  const totalSupply = parseInt(await vault.methods.totalSupply().call());
  const totalToken = parseInt(await vault.methods.totalToken().call());
  const balance = await vault.methods.balanceOf(getFairLaunch()).call();

  // let stakeValue = (balance * param.baseTokenPrice * totalToken) / totalSupply;
  const stakeValue = (balance * 100 * totalToken) / totalSupply;

  return stakeValue;
}

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
};

export const deposit = async (address, amount) => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  const tx = await vault.deposit(value, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const withdraw = async (address, amount) => {
  const vault = getVaultContract(address);
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();

  const tx = await vault.withdraw(value, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const farm = async (address, pid, worker, amount, loan, maxReturn, param: any) => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(['uint256', 'uint256'], [param.farmingTokenAmount, param.minLPAmount]);
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);

  const tx = await vault.work(pid, worker, amount, loan, maxReturn, dataWorker, options);
  const receipt = await tx.wait();
  return receipt.status;
};

export const unfarm = async (address, pid, worker, amount, loan, maxReturn, param: any) => {
  const vault = getVaultContract(address);
  const abiCoder = new ethers.utils.AbiCoder();
  const dataStrategy = abiCoder.encode(['uint256'], [param.minFarmingToken]);
  const dataWorker = abiCoder.encode(['address', 'bytes'], [param.address, dataStrategy]);

  const tx = await vault.work(pid, worker, amount, loan, maxReturn, dataWorker, options);
  const receipt = await tx.wait();
  return receipt.status;
};
