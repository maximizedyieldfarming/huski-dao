import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import useRefresh from 'hooks/useRefresh'
import { getBalanceAmount } from 'utils/formatBalance'


const useFarmsWithToken = (farm, bnbBalance, tokenBalance) => {
  const { vaultDebtVal, totalToken, token } = farm

  useEffect(() => {
    const fetchBorrowingInterest = async () => {
      const configAddress = getAddress(token.config)
      const userTokenBalance = getBalanceAmount(
        token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
      )

      const vdv = vaultDebtVal ? new BigNumber(parseInt(vaultDebtVal)).div(BIG_TEN.pow(18)): BIG_ZERO //  
      // const bb = userTokenBalance || BIG_ZERO
      const tt = totalToken ? new BigNumber(parseInt(totalToken)).div(BIG_TEN.pow(18)): BIG_ZERO //  
      const vdvData = Math.round(vdv.toNumber())
      // const bbb = Math.round(bb.toNumber())
      const ttData = Math.round(tt.toNumber())

      const [borrowingInterest] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: configAddress,
            name: 'getInterestRate',
            params: [vdvData, ttData-vdvData],// 借贷值从vault合约中取， base token 的balance
          }
        ])
        console.info('----borrowingInterest', (borrowingInterest));
      console.info('------', parseInt(borrowingInterest[0]._hex) * 365 * 24 * 60 * 60 / (10 **18));

    }

    fetchBorrowingInterest()

  }, [bnbBalance, token.config, token.symbol, tokenBalance, totalToken, vaultDebtVal])

  return {  }
}

export default useFarmsWithToken
