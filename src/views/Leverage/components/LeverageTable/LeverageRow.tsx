import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import { getAddress } from 'utils/addressHelpers'
import  useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
import {useFarmsWithToken} from '../../hooks/useFarmsWithToken'
import ApyCell from './Cells/ApyCell'
import ActionCell from './Cells/ActionCell'
import PoolCell from './Cells/PoolCell'
import LeverageCell from './Cells/LeverageCell'
import TvlCell from './Cells/TvlCell'
import Borrowing from './Cells/Borrowing'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  //cursor: pointer;
`

const LeverageRow = ({ tokenData }) => {
  const { lpSymbol, leverage } = tokenData
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const [childLeverage, setChildLeverage] = useState(leverage)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const onChildValueChange = (val) => {
    setChildLeverage(val)
  }

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, huskyPerBlock, childLeverage)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)
  const { tokensLP, tokenNum, quoteTokenNum, totalTvl } = getTvl(tokenData)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.token.address))
  // const { borrowInterest } = useFarmsWithToken(tokenData, bnbBalance, tokenBalance) // 计算方式换了
  const {borrowingInterest} = getBorrowingInterest(tokenData)

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell
          pool={lpSymbol.replace(' LP', '')}
          tokenData={tokenData}
          tvl={totalTvl.toNumber()}
          lpTokens={tokensLP}
        />
        <ApyCell
          apyAtOne={getDisplayApr(yieldFarmData * 1)}
          apy={getDisplayApr(yieldFarmData * childLeverage)}
          yieldFarming={yieldFarmData * childLeverage}
          tradingFees={tokenData.tradeFee * childLeverage}
          huskyRewards={huskyRewards * (childLeverage - 1)}
          borrowingInterest={borrowingInterest * (childLeverage - 1)}
        />
        <TvlCell tvl={totalTvl.toNumber()} tokenData={tokenData} />
        <Borrowing tokenData={tokenData} />
        <LeverageCell leverage={leverage} onChange={onChildValueChange} />
        <ActionCell token={tokenData} />
      </StyledRow>
    </>
  )
}

export default LeverageRow
