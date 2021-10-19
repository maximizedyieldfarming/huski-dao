import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import ConfigurableInterestVaultConfigABI from 'config/abi/ConfigurableInterestVaultConfig.json'
import useRefresh from 'hooks/useRefresh'
import { getBalanceAmount } from 'utils/formatBalance'


const useFarmsWithToken = (farm, bnbBalance, tokenBalance) => {
  const { vaultDebtVal, token } = farm

  useEffect(() => {
    const fetchBorrowingInterest = async () => {
      const configAddress = getAddress(token.config)
      const userTokenBalance = getBalanceAmount(
        token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
      )

      const aa = vaultDebtVal ? new BigNumber(parseInt(vaultDebtVal)).div(BIG_TEN.pow(18)) : BIG_ZERO // (10 **18)
      const bb = userTokenBalance || BIG_ZERO

      const aaa = Math.round(aa.toNumber())
      const bbb = Math.round(bb.toNumber())

      console.log({ vaultDebtVal ,aa , bb,aaa, bbb});

      const [borrowingInterest] =
        await multicall(ConfigurableInterestVaultConfigABI, [
          {
            address: configAddress,
            name: 'getInterestRate',
            params: [aaa, bbb],// 借贷值从vault合约中取， base token 的balance
          }
        ])
        console.info('----borrowingInterest--0', (borrowingInterest));
      console.info('------', parseInt(borrowingInterest[0]._hex));

    }

    fetchBorrowingInterest()

  }, [bnbBalance, token.config, token.symbol, tokenBalance, vaultDebtVal])

  return {  }
}

export default useFarmsWithToken
