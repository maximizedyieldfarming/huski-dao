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
  const totalPositionValue = new BigNumber(Number(totalPositionValueInUSD.hex) / busdPrice).dividedBy(BIG_TEN.pow(18))
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const tradingFees = Number(tradeFee) * Number(leverage) * 365

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          We will convert the minimum required amount of tokens into ETH to pay back the debt and return the remaining
          assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </GrayBox>
      <CloseEntirePosition
        totalPositionValue={totalPositionValue}
        tradingFees={tradingFees}
        debtValue={debtValueNumber}
        amountToTrade={undefined}
        priceImpact={undefined}
        convertedPositionValue={undefined}
      />
    </>
  )
}

export default MinimizeTrading
