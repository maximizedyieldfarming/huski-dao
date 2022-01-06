/* eslint-disable no-restricted-properties */
import React, { useState } from 'react'
import styled from 'styled-components'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import { getHuskyRewards, getYieldFarming, getTvl } from '../../helpers'
import PoolCell from './Cells/PoolCell'
import ApyCell from './Cells/ApyCell'
import ActionCell from './Cells/ActionCell'
import { useFarmsWithToken } from '../../hooks/useFarmsWithToken'
import { useTradingFees } from '../../hooks/useTradingFees'
import LeverageCell from './Cells/LeverageCell'
import TvlCell from './Cells/TvlCell'
import Borrowing from './Cells/Borrowing'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 0;
  }
`

const LeverageRow = ({ tokenData }) => {
  const { lpSymbol, leverage } = tokenData
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const onChildValueChange = (val) => {
    setChildLeverage(val)
  }

  const [borrowingAsset, setBorrowingAsset] = useState(tokenData?.TokenInfo?.token?.symbol)
  const onBorrowingAssetChange = (asset) => {
    setBorrowingAsset(asset)
  }

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, borrowingAsset)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)
  const { tokensLP, tokenNum, quoteTokenNum, totalTvl } = getTvl(tokenData)
  const { borrowingInterest } = useFarmsWithToken(tokenData, borrowingAsset)
  const { tradingFees: tradeFee } = useTradingFees(tokenData)
  // const { borrowingInterest } = getBorrowingInterest(tokenData, borrowingAsset)

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

  const getLeverageWithHighestApy = () => {
    const lvgArray = []
    for (let i = 1; i < leverage / 0.5; i++) {
      lvgArray.push(1 + 0.5 * (-1 + i))
    }
    // which lvg has highest apy
    const apyArray = lvgArray.map((lvg) => getApy(lvg))
    const maxApy = Math.max(...apyArray)
    const index = apyArray.indexOf(maxApy)
    const leveragewithHighestApy = lvgArray[index]

    return leveragewithHighestApy
  }
  const lvgWithHighestApy = getLeverageWithHighestApy()

  const [childLeverage, setChildLeverage] = useState(lvgWithHighestApy || leverage)
  React.useEffect(() => {
    if (lvgWithHighestApy) {
      setChildLeverage(lvgWithHighestApy)
    }
  }, [lvgWithHighestApy])

  return (
    <>
      <StyledRow role="row">
        <PoolCell pool={lpSymbol.replace(' LP', '')} tokenData={tokenData} />
        <ApyCell
          apyAtOne={getDisplayApr(getApy(1))}
          apy={getDisplayApr(getApy(childLeverage))}
          yieldFarming={yieldFarmData * childLeverage}
          tradingFees={tradeFee * 365 * childLeverage}
          huskyRewards={huskyRewards * 100 * (childLeverage - 1)}
          borrowingInterest={borrowingInterest * 100 * (childLeverage - 1)}
        />
        <TvlCell
          tvl={totalTvl.toNumber()}
          tokenData={tokenData}
          lpTokens={tokensLP}
          tokenNum={tokenNum}
          quoteTokenNum={quoteTokenNum}
        />
        <Borrowing tokenData={tokenData} onBorrowingAssetChange={onBorrowingAssetChange} />
        <LeverageCell leverage={leverage} onChange={onChildValueChange} childLeverage={childLeverage} />
        <ActionCell token={tokenData} selectedLeverage={childLeverage} selectedBorrowing={borrowingAsset} />
      </StyledRow>
    </>
  )
}

export default LeverageRow
