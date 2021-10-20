import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import { getHuskyRewards, getYieldFarming, getTvl, getLeverageFarmingData } from '../../helpers'
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

const ScrollContainer = styled.div`
  overflow-x: auto;
  display: flex;
  flex: 1;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
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

  const { vault, positionId, debtValue, baseAmount, totalPositionValueInUSD } = data
  const { quoteToken, token } = data.farmData

  // const totalPositionValueInUSDData = data.totalPositionValueInUSD
  const tokenBusdPrice = data.farmData?.token.busdPrice
  const totalPositionValue = parseInt(totalPositionValueInUSD.hex) / tokenBusdPrice
  const totalPositionValueInToken = new BigNumber(totalPositionValue).dividedBy(BIG_TEN.pow(18))

  // const debtValueData = data.debtValue
  // const baseAmountData = data.baseAmount
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))

  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(debtValue).div(new BigNumber(baseAmount)).plus(1)

  // const farmingData = getLeverageFarmingData(data.farmData, leverage.toNumber(), '0.04', '0.0065')

  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(data.farmData, huskyPrice, huskyPerBlock, leverage)
  const yieldFarmData = getYieldFarming(data.farmData, cakePrice)
  // const { tokensLP, tokenNum, quoteTokenNum, totalTvl } = getTvl(tokenData)
  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const borrowingInterest = new BigNumber(data?.farmData?.borrowingInterest).div(BIG_TEN.pow(18)).toNumber()
  const profitLoss = undefined

  const liquidationThreshold = 83.33 // 暂时写死
  const debtRatioRound: any = debtRatio ? debtRatio.toNumber() * 100 : 0
  const safetyBuffer = Math.round(liquidationThreshold - debtRatioRound)

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <NameCell name={null} positionId={positionId} />
        <PoolCell pool={data.farmData?.lpSymbol} quoteToken={quoteToken} token={token} />
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
