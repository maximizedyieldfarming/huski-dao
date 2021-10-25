import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import CloseEntirePosition from './CloseEntirePosition'

const GrayBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
`
const Section = styled(Flex)`
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  }
  > ${Flex}, > ${Box} {
    padding: 1rem 0;
  }
  input[type='range'] {
    -webkit-appearance: auto;
  }
`

const MinimizeTrading = ({ data, isCloseEntire }) => {
  // console.log({ data })

  const { totalPositionValueInUSD, debtValue } = data

  const { busdPrice } = data.farmData.token
  const { tradeFee, leverage } = data.farmData
  const { busdPrice: tokenBusdPrice, symbol: token } = data.farmData.token
  const { busdPrice: quoteTokenBusdPrice, symbol: quoteToken } = data.farmData.quoteToken
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const tradingFees = Number(tradeFee) * Number(leverage) * 365

  const baseAmountData = data.baseAmount
  const farmAmountData = data.farmAmount
  const baseTokenAmount = new BigNumber(baseAmountData).dividedBy(BIG_TEN.pow(18))
  const farmTokenAmount = new BigNumber(farmAmountData).dividedBy(BIG_TEN.pow(18))

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          We will convert the minimum required amount of tokens into {token} to pay back the debt and return the
          remaining assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </GrayBox>
      <CloseEntirePosition
        data={data}
        baseTokenAmount={baseTokenAmount}
        farmTokenAmount={farmTokenAmount}
        tradingFees={tradingFees}
        debtValue={debtValueNumber}
        priceImpact={undefined}
        token={data.farmData.token}
        quoteToken={data.farmData.quoteToken}
      />
    </>
  )
}

export default MinimizeTrading
