import { getWeb3VaultContract, getWeb3Erc20Contract } from './contractHelpers';
import { getAddress } from './addressHelpers'

export async function getPoolInfo(param: any) {

  const address = '0x1484a6020a0f08400f6f56715016d2c80e26cdc1' //  getAddress(param.token.address)
  const vaultAddress = getAddress(param.vaultAddress)
  const vault11 = getWeb3Erc20Contract(address);
  const name = await vault11.methods.name().call();
  // const contract = getBep20Contract(address)
  // const res = await contract.balanceOf('0x55Fb836eaD6521009D2C9310770CE055E7041Cd8')
  const vault = getWeb3VaultContract(vaultAddress);
  const getCode = await vault.methods.getCode().call();
  const getPrice = await vault.methods.getPrice().call();
  //  await contract.name();
  const data = {
    name,
    getCode,
    getPrice
  };
  return data;
}


// export const deposit = async (address, amount) => {
//   const vault = getVaultContract(address);
//   const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
//   const tx = await vault.deposit(value, options);
//   const receipt = await tx.wait();
//   return receipt.status;
// };
// export const withdraw = async (address, amount) => {
//   const vault = getVaultContract(address);
//   const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString();
//   const tx = await vault.withdraw(value, options);
//   const receipt = await tx.wait();
//   return receipt.status;
// };