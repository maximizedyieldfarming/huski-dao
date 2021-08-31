import { getWeb3HuskyTokenContract } from './contractHelper';


export async function getBalanceOf(param: any) {
    const husky = getWeb3HuskyTokenContract();

    const balance = await husky.methods.balanceOf(param.userAddress).call();

    return balance;
}