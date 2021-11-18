import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
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

  const { positionId, debtValue, lpAmount, positionValueBase, vault } = data
  const { lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal, TokenInfo, QuoteTokenInfo, liquidationThreshold, quoteTokenLiquidationThreshold } = data.farmData

  let symbolName;
  let lpSymbolName;
  let tokenValue;
  let quoteTokenValue;
  let baseAmount;
  let liquidationThresholdValue;

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name
    tokenValue = TokenInfo?.token;
    quoteTokenValue = TokenInfo?.quoteToken;
    baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    liquidationThresholdValue = liquidationThreshold
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name
    tokenValue = TokenInfo?.quoteToken;
    quoteTokenValue = TokenInfo?.token;
    baseAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    liquidationThresholdValue = quoteTokenLiquidationThreshold
  }

  // const baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(baseAmount).times(2).div((new BigNumber(baseAmount).times(2)).minus(new BigNumber(debtValueNumber)))

  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(data.farmData, huskyPrice, symbolName)
  const yieldFarmData = getYieldFarming(data.farmData, cakePrice)

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const borrowingInterest = new BigNumber(data?.farmData?.borrowingInterest).div(BIG_TEN.pow(18)).toNumber()
  const profitLoss = undefined

  const liquidationThresholdData = parseInt(liquidationThresholdValue) / 100
  const debtRatioRound: any = debtRatio ? debtRatio.toNumber() * 100 : 0
  const safetyBuffer = Math.round(liquidationThresholdData - debtRatioRound)

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell name={symbolName} positionId={positionId} />
        <PoolCell pool={lpSymbolName.replace(' PancakeswapWorker', '')} quoteToken={quoteTokenValue} token={tokenValue} />
        <PositionValueCell position={totalPositionValueInToken} name={symbolName} />
        <DebtCell debt={debtValueNumber} borrowedAssets={null} borrowingInterest={borrowingInterest.toPrecision(3)} name={symbolName} />
        <EquityCell equity={totalPositionValueInToken.toNumber() - debtValueNumber.toNumber()} name={symbolName} />
        <ApyCell
          apy={getDisplayApr(yieldFarmData * leverage.toNumber())}
          huskyRewards={huskyRewards}
          apr={null}
          borrowingInterest={null}
          liquidityRewards={null}
          tradingFeesRewards={null}
        />
        <DebtRatioCell debtRatio={debtRatio} />
        <LiquidationThresholdCell liquidationThreshold={liquidationThresholdData} />
        <SafetyBufferCell safetyBuffer={safetyBuffer} />
        <ProfitsCell profitLoss={profitLoss} />
        <ActionCell
          posData={{ data, liquidationThresholdData }}
          disabled={!getDisplayApr(yieldFarmData * leverage.toNumber())}
        />
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
