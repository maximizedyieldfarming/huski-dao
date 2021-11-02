import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import { getHuskyRewards, getYieldFarming } from '../../helpers'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import PoolCell from './Cells/PoolCell'
import ActionCell from './Cells/ActionCell'
import PositionValueCell from './Cells/PositionValueCell'
import DebtCell from './Cells/DebtCell'
import EquityCell from './Cells/EquityCell'
import DebtRatioCell from './Cells/DebtRatioCell'
import LiquidationThresholdCell from './Cells/LiquidationThresholdCell'
import SafetyBufferCell from './Cells/SafetyBufferCell'
import LiquidatedEquityCell from './Cells/LiquidatedEquityCell'
import LiquidationFeeCell from './Cells/LiquidationFeeCell'
import AssetsReturnedCell from './Cells/AssetsReturnedCell'
import ProfitsCell from './Cells/ProfitsCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  //cursor: pointer;
`

const ActivePositionsRow = ({ data }) => {
  console.log('active Positions data', data)
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { positionId, debtValue, lpAmount, positionValueBase } = data
  const { lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, quoteToken, token } = data.farmData

  const baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18))// positionValueBaseNumber
  // const totalPositionValueInUSD1 = positionValueBaseNumber.times(token.busdPrice)
  // const tokenBusdPrice = data.farmData?.token.busdPrice
  // const totalPositionValue =  parseInt(totalPositionValueInUSD.hex) / tokenBusdPrice
  // const totalPositionValueInToken = positionValueBaseNumber // new BigNumber(totalPositionValue).dividedBy(BIG_TEN.pow(18))

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(debtValueNumber).div(new BigNumber(baseAmount)).plus(1)

  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(data.farmData, huskyPrice)
  const yieldFarmData = getYieldFarming(data.farmData, cakePrice)

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const borrowingInterest = new BigNumber(data?.farmData?.borrowingInterest).div(BIG_TEN.pow(18)).toNumber()
  const profitLoss = undefined

  const liquidationThreshold = parseInt(data?.farmData?.liquidationThreshold) / 100
  const debtRatioRound: any = debtRatio ? debtRatio.toNumber() * 100 : 0
  const safetyBuffer = Math.round(liquidationThreshold - debtRatioRound)

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell name={null} positionId={positionId} />
        <PoolCell pool={data.farmData?.lpSymbol.replace(' LP', '')} quoteToken={quoteToken} token={token} />
        <PositionValueCell position={totalPositionValueInToken} />
        <DebtCell debt={debtValueNumber} borrowedAssets={null} borrowingInterest={borrowingInterest.toPrecision(3)} />
        <EquityCell equity={totalPositionValueInToken.toNumber() - debtValueNumber.toNumber()} />
        <ApyCell
          apy={getDisplayApr(yieldFarmData * leverage.toNumber())}
          huskyRewards={huskyRewards}
          apr={null}
          borrowingInterest={null}
          liquidityRewards={null}
          tradingFeesRewards={null}
        />
        <DebtRatioCell debtRatio={debtRatio} />
        <LiquidationThresholdCell liquidationThreshold={liquidationThreshold} />
        <SafetyBufferCell safetyBuffer={safetyBuffer} />
        <ProfitsCell profitLoss={profitLoss} />
        <ActionCell
          posData={{ data, liquidationThreshold }}
          disabled={!getDisplayApr(yieldFarmData * leverage.toNumber())}
        />
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
