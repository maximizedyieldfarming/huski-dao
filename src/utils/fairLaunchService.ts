import BigNumber from 'bignumber.js'

import { getFairLaunchContract, getWeb3FairLaunchContract } from './contractHelper';
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from './config';

export async function getPoolHuskyPerBlock(param: any) {
    const fairLaunch = getWeb3FairLaunchContract();

    const alpacaPerBlock = await fairLaunch.methods.alpacaPerBlock().call();
    const totalAllocPoint = await fairLaunch.methods.totalAllocPoint().call();
    const poolInfo = await fairLaunch.methods.poolInfo(param.pId).call();

    const poolAlpacaPerBlock = alpacaPerBlock * poolInfo.allocPoint / totalAllocPoint;
    return poolAlpacaPerBlock;
}

export async function getPoolHuskyDaily(param: any) {
    const fairLaunch = getWeb3FairLaunchContract();

    const alpacaPerBlock = await fairLaunch.methods.alpacaPerBlock().call();
    const totalAllocPoint = await fairLaunch.methods.totalAllocPoint().call();
    const poolInfo = await fairLaunch.methods.poolInfo(param.id).call();

    const poolHuskyDaily = alpacaPerBlock * poolInfo.allocPoint * 24 * 60 * 60 / 3 / totalAllocPoint; // 24*60*60/3：24小时出块数量
    return poolHuskyDaily;
}

const options = {
    gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (address, pid, amount) => {
    const fairLaunch = getFairLaunchContract();
    const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

    const tx = await fairLaunch.deposit(address, pid, value, options)
    const receipt = await tx.wait()
    return receipt.status
}

export const unstakeFarm = async (address, pid, amount) => {
    const fairLaunch = getFairLaunchContract();
    const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

    const tx = await fairLaunch.withdraw(address, pid, value, options)
    const receipt = await tx.wait()
    return receipt.status
}

export const harvestFarm = async (pid) => {
    const fairLaunch = getFairLaunchContract();

    const tx = await fairLaunch.harvest(pid, options)
    const receipt = await tx.wait()
    return receipt.status
}
