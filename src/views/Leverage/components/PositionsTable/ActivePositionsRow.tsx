/* eslint-disable no-restricted-properties */
import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useLocation } from 'react-router-dom'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import { getHuskyRewards, getYieldFarming, getDrop } from '../../helpers'
import { useFarmsWithToken } from '../../hooks/useFarmsWithToken'
import { useTradingFees } from '../../hooks/useTradingFees'
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
import StrategyCell from './Cells/StrategyCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  padding-top: 15px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }

  //cursor: pointer;
`

const ActivePositionsRow = ({ data }) => {
  const { pathname } = useLocation()

  const { positionId, debtValue, lpAmount, positionValueBase, vault } = data
  const {
    lptotalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
    TokenInfo,
    QuoteTokenInfo,
    liquidationThreshold,
    quoteTokenLiquidationThreshold,
  } = data.farmData

  let symbolName
  let lpSymbolName
  let tokenValue
  let quoteTokenValue
  let baseAmount
  let liquidationThresholdValue

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name
    tokenValue = TokenInfo?.token
    quoteTokenValue = TokenInfo?.quoteToken
    baseAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    liquidationThresholdValue = liquidationThreshold
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name
    tokenValue = TokenInfo?.quoteToken
    quoteTokenValue = TokenInfo?.token
    baseAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    liquidationThresholdValue = quoteTokenLiquidationThreshold
  }

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18))
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const leverage = new BigNumber(baseAmount)
    .times(2)
    .div(new BigNumber(baseAmount).times(2).minus(new BigNumber(debtValueNumber)))

  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName)
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const dropData = getDrop(data?.farmData, data, symbolName)
  const { borrowingInterest } = useFarmsWithToken(data?.farmData, symbolName)
  const { tradingFees: tradeFee } = useTradingFees(data?.farmData)

  const getApr = (lvg) => {
    if (
      Number(tradeFee) === 0 ||
      Number(huskyRewards) === 0 ||
      Number(borrowingInterest) === 0 ||
      Number(yieldFarmData) === 0 ||
      Number.isNaN(tradeFee) ||
      Number.isNaN(huskyRewards) ||
      Number.isNaN(borrowingInterest) ||
      Number.isNaN(yieldFarmData)
    ) {
      return null
    }
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return apr
  }

  const getApy = (lvg) => {
    const apr = getApr(lvg)
    if (apr === null) { 
      return null
    }
    const apy = Math.pow(1 + apr / 365, 365) - 1
    return apy * 100
  }

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const profitLoss = undefined

  const liquidationThresholdData = Number(liquidationThresholdValue) / 100
  const debtRatioRound: any = debtRatio ? debtRatio.toNumber() * 100 : 0
  const safetyBuffer = Math.round(liquidationThresholdData - debtRatioRound)

  return (
    <>
      <StyledRow role="row">
        <NameCell name={symbolName} positionId={positionId} />
        <PoolCell
          pool={lpSymbolName.replace(' PancakeswapWorker', '').toUpperCase().replace('WBNB', 'BNB')}
          quoteToken={quoteTokenValue}
          token={tokenValue}
          exchange={data?.farmData.lpExchange}
        />
        {pathname.includes('singleAssets') ? <StrategyCell strategy={null} /> : null}
        <PositionValueCell position={totalPositionValueInToken} name={symbolName} />
        {pathname.includes('farms') ? (
          <DebtCell
            debt={debtValueNumber}
            borrowedAssets={null}
            borrowingInterest={borrowingInterest.toPrecision(3)}
            name={symbolName}
          />
        ) : null}
        <EquityCell equity={totalPositionValueInToken.toNumber() - debtValueNumber.toNumber()} name={symbolName} />
        <ApyCell
          apr={getApr(leverage.toNumber()) * 100}
          dailyApr={getApr(leverage.toNumber()) / 365 * 100}
          apy={getDisplayApr(getApy(leverage.toNumber()))}
          yieldFarming={yieldFarmData * leverage.toNumber()}
          tradingFees={tradeFee * 365 * leverage.toNumber()}
          huskyRewards={huskyRewards * 100 * (leverage.toNumber() - 1)}
          borrowingInterest={borrowingInterest * 100 * (leverage.toNumber() - 1)}
        />

        {pathname.includes('farms') ? (
          <>
            <DebtRatioCell debtRatio={debtRatio} />
            <LiquidationThresholdCell liquidationThreshold={liquidationThresholdData} noDebt={debtValueNumber.toNumber() === 0 && debtRatio.toNumber() === 0} />{' '}
          </>
        ) : null}
        <SafetyBufferCell
          liquidationThresholdData={liquidationThresholdData}
          debtRatioRound={debtRatioRound}
          safetyBuffer={safetyBuffer}
          tokenName={tokenValue?.symbol}
          quoteTokenName={quoteTokenValue?.symbol}
          priceDrop={new BigNumber(dropData).toFixed(2, 1)}
          noDebt={debtValueNumber.toNumber() === 0 && debtRatio.toNumber() === 0}
        />
        {/* <ProfitsCell profitLoss={profitLoss} /> */}
        <ActionCell
          posData={{ data, liquidationThresholdData }}
          disabled={!getDisplayApr(yieldFarmData * leverage.toNumber())}
          name={lpSymbolName.replace(' PancakeswapWorker', '')}
        />
      </StyledRow>
    </>
  )
}

export default ActivePositionsRow
