import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'husky-uikit1.0'
import { useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import NameCell from './Cells/NameCell'
import { getAprData } from '../../helpers'
import { useFarmsWithToken } from '../../../Leverage/hooks/useFarmsWithToken'
import UtilRateCell from './Cells/UtilRateCell'
import ApyCell from './Cells/ApyCell'
import TotalSupplyCell from './Cells/TotalSupplyCell'
import TotalBorrowedCell from './Cells/TotalBorrowedCell'
import BalanceCell from './Cells/BalanceCell'
import ActionCell from './Cells/ActionCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  overflow : auto;
  width : 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  ::-webkit-scrollbar {
    height: 4px!important;
  }
  //cursor: pointer;
`

const LendRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const huskyPrice = useHuskiPrice()
  const tokenName = tokenData?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB');

  const { borrowingInterest } = useFarmsWithToken(tokenData, tokenName)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  const { totalToken, vaultDebtVal, userData, TokenInfo, tokenPriceUsd } = tokenData
  const totalSupplyUSD = Number(totalToken) * Number(tokenPriceUsd)
  const totalBorrowedUSD = Number(vaultDebtVal) * Number(tokenPriceUsd)
  const [isShown, setIsShown] = useState(false);
  
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  // const tokenBalanceIb = tokenData?.userData?.tokenBalanceIB
  const userTokenBalance = getBalanceAmount(
    TokenInfo.token.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  ).toJSON()
  const userTokenBalanceIb = getBalanceAmount(useTokenBalance(tokenData?.TokenInfo.vaultAddress).balance).toJSON()
  return (
    <>
      <StyledRow 
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)} role="row" onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <ApyCell getApyData={getAprData(tokenData, huskyPrice, borrowingInterest)} token={tokenData} />
        <TotalSupplyCell supply={Number(totalToken)} supplyUSD={totalSupplyUSD} />
        <TotalBorrowedCell borrowed={Number(vaultDebtVal)} borrowedUSD={totalBorrowedUSD} />
        <UtilRateCell utilRate={totalToken > 0 ? vaultDebtVal / totalToken : 0} />
        <BalanceCell
          balance={userTokenBalance}
          balanceIb={userTokenBalanceIb}
          name={TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
          decimals={TokenInfo?.token?.decimalsDigits}
        />
        <ActionCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default LendRow
