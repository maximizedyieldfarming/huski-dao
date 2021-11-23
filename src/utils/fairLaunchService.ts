import BigNumber from 'bignumber.js'

import { getFairLaunchContract, getWeb3FairLaunchContract } from './contractHelper';
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from './config';


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
