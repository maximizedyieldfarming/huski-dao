import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import useFarmsWithToken from '../../hooks/usePositionsFarmsWithToken'
import { getHuskyRewards, getYieldFarming, getTvl, getLeverageFarmingData } from '../../helpers'
import NameCell from './Cells/NameCell'
import ApyCell from './Cells/ApyCell'
import PoolCell from './Cells/PoolCell'
import ActionCell from './Cells/ActionCell'
import PositionCell from './Cells/PositionCell'
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
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const vaultAddress = data.vault
  // useFarmsWithToken(vaultAddress)

  const totalPositionValueInUSDData = data.totalPositionValueInUSD
  const tokenBusdPrice = data.farmData?.token.busdPrice
  const totalPositionValue = parseInt(totalPositionValueInUSDData.hex) / tokenBusdPrice
  const totalPositionValueInToken = new BigNumber(totalPositionValue).dividedBy(BIG_TEN.pow(18))

  const debtValueData = data.debtValue
  const baseAmountData = data.baseAmount
  const debtValue = new BigNumber(debtValueData).dividedBy(BIG_TEN.pow(18))

  const debtRatio = new BigNumber(debtValue).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(debtValueData).div(new BigNumber(baseAmountData)).plus(1)


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

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell pool={data.farmData?.lpSymbol} />
        <PositionCell position={totalPositionValueInToken} />
        <DebtCell debt={debtValue} />
        <EquityCell equity={totalPositionValueInToken.toNumber() - debtValue.toNumber()} />
        <ApyCell
          apy={getDisplayApr(yieldFarmData * leverage.toNumber())}
          huskyRewards={huskyRewards}
          apr={null}
          borrowingInterest={null}
          liquidityRewards={null}
          tradingFeesRewards={null}
        />
        <DebtRatioCell debtRatio={debtRatio} />
        <LiquidationThresholdCell liqTres={data?.capitalUtilizationRate} />
        <SafetyBufferCell safetyBuffer={data?.capitalUtilizationRate} />
        <ProfitsCell liqEquity={data?.liqEquity} />
        <ActionCell data={data} /> 
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
