/* eslint-disable no-restricted-properties */
import React, { useState, useEffect, useCallback } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
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

  // check which borrowing asset gives bigger apy

  const yieldFarmData = getYieldFarming(tokenData, cakePrice)
  const { tokensLP, totalTvl } = getTvl(tokenData)

  const getBorrowingAsset = useCallback(
    (lvg: number) => {
      const { token, quoteToken } = tokenData?.TokenInfo
      const tokenHuskyRewards = getHuskyRewards(tokenData, huskyPrice, token.symbol)
      const quoteTokenHuskyRewards = getHuskyRewards(tokenData, huskyPrice, quoteToken.symbol)
      const { borrowingInterest: tokenBorrowingInterest } = getBorrowingInterest(tokenData, token.symbol)
      const { borrowingInterest: quoteTokenBorrowingInterest } = getBorrowingInterest(tokenData, quoteToken.symbol)
      console.log({
        tokenBorrowingInterest,
        quoteTokenBorrowingInterest,
        tokenHuskyRewards,
        quoteTokenHuskyRewards,
        yieldFarmData,
        lvg,
      })
      const tokenApr =
        Number((yieldFarmData / 100) * lvg) +
        Number(((tokenData.tradeFee * 365) / 100) * lvg) +
        Number(tokenHuskyRewards * (lvg - 1)) -
        Number(tokenBorrowingInterest * (lvg - 1))
      const quoteTokenApr =
        Number((yieldFarmData / 100) * lvg) +
        Number(((tokenData.tradeFee * 365) / 100) * lvg) +
        Number(quoteTokenHuskyRewards * (lvg - 1)) -
        Number(quoteTokenBorrowingInterest * (lvg - 1))
      console.log('tokenApr', tokenApr, 'quoteTokenApr', quoteTokenApr)
      if (
        quoteToken.symbol === 'CAKE' ||
        quoteToken.symbol === 'USDC' ||
        quoteToken.symbol === 'SUSHI' ||
        quoteToken.symbol === 'DOT'
      ) {
        return token.symbol
      }
      if (token.symbol === 'CAKE' || token.symbol === 'USDC' || token.symbol === 'SUSHI' || token.symbol === 'DOT') {
        return quoteToken.symbol
      }

      if (Number(tokenApr) > Number(quoteTokenApr)) {
        return token.symbol
      }
      return quoteToken.symbol
    },
    [huskyPrice, tokenData, yieldFarmData],
  )

  const [borrowingAsset, setBorrowingAsset] = useState(getBorrowingAsset(leverage))
  useEffect(() => {
    setBorrowingAsset(getBorrowingAsset(leverage))
  }, [leverage, getBorrowingAsset])
  console.log('pool', tokenData.lpSymbol, 'borrowingAsset', borrowingAsset)
  const onBorrowingAssetChange = (asset) => {
    setBorrowingAsset(asset)
  }

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, borrowingAsset)
  const { borrowingInterest } = getBorrowingInterest(tokenData, borrowingAsset)

  const getApr = (lvg) => {
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((tokenData.tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return apr
  }

  const getApy = (lvg) => {
    const apr = getApr(lvg)
    const apy = Math.pow(1 + apr / 365, 365) - 1
    return apy * 100
  }

  // const apyarray = [];
  // const newLeverage = leverage
  // for (let i = 1; i <= leverage; i++) {
  //   // if (getApy(i) >= getApy(i + 1)) {
  //     // newLeverage = i;
  //     apyarray.push(getApy(i))
  //   // }
  //   // break;
  // }

  // console.log({'newLeverage--': apyarray, 'lpSymbol': lpSymbol, childLeverage })

  return (
    <>
      <StyledRow role="row" onClick={toggleExpanded}>
        <PoolCell pool={lpSymbol.replace(' LP', '')} tokenData={tokenData} />
        <ApyCell
          apyAtOne={getDisplayApr(getApy(1))}
          apy={getDisplayApr(getApy(childLeverage))}
          yieldFarming={yieldFarmData * childLeverage}
          tradingFees={tokenData.tradeFee * 365 * childLeverage}
          huskyRewards={huskyRewards * 100 * (childLeverage - 1)}
          borrowingInterest={borrowingInterest * 100 * (childLeverage - 1)}
        />
        <TvlCell tvl={totalTvl.toNumber()} tokenData={tokenData} lpTokens={tokensLP} />
        <Borrowing
          tokenData={tokenData}
          onBorrowingAssetChange={onBorrowingAssetChange}
          defaultBorrowing={getBorrowingAsset(leverage)}
          show={!!getApy(childLeverage)}
        />
        <LeverageCell leverage={leverage} onChange={onChildValueChange} />
        <ActionCell token={tokenData} selectedLeverage={childLeverage} selectedBorrowing={borrowingAsset} />
      </StyledRow>
    </>
  )
}

export default LeverageRow
