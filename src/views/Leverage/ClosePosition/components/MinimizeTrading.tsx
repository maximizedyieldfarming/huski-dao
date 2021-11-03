import React, { useState, useRef, useEffect } from 'react'
import { Box, Text  } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import CloseEntirePosition from './CloseEntirePosition'

const GrayBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
`

const MinimizeTrading = ({ data, isCloseEntire }) => {

  const { debtValue, lpAmount, vault } = data
  const { quoteToken, token, TokenInfo, QuoteTokenInfo, tradeFee, leverage, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = data.farmData
  let symbolName;
  // let tokenValue;
  // let quoteTokenValue;
  // let tokenValueSymbol;
  // let quoteTokenValueSymbol;
  // let baseTokenAmount;
  // let farmTokenAmount;
  // let basetokenBegin;
  // let farmingtokenBegin;
  // let workerAddress;
  // let withdrawMinimizeTradingAddress;

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    // tokenValue = token;
    // quoteTokenValue = quoteToken;
    // tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    // quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    // baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // basetokenBegin = parseInt(tokenAmountTotal)
    // farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    // workerAddress = TokenInfo.address
    // withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyLiquidate

  } else {
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    // tokenValue = quoteToken;
    // quoteTokenValue = token;
    // tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    // quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // basetokenBegin = parseInt(quoteTokenAmountTotal)
    // farmingtokenBegin = parseInt(tokenAmountTotal)
    // workerAddress = QuoteTokenInfo.address
    // withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyLiquidate

  }








  // const { busdPrice: tokenBusdPrice, symbol: token } = data.farmData.token
  // const { busdPrice: quoteTokenBusdPrice, symbol: quoteToken } = data.farmData.quoteToken
  // const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  // const tradingFees = Number(tradeFee) * Number(leverage) * 365

  // const baseTokenAmount =  new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
  // const farmTokenAmount =  new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          We will convert the minimum required amount of tokens into {symbolName} to pay back the debt and return the
          remaining assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </GrayBox>
      <CloseEntirePosition
        data={data}
        // baseTokenAmount={baseTokenAmount}
        // farmTokenAmount={farmTokenAmount}
        // tradingFees={tradingFees}
        // debtValue={debtValueNumber}
        // priceImpact={undefined}
        // token={data.farmData.token}
        // quoteToken={data.farmData.quoteToken}
      />
    </>
  )
}

export default MinimizeTrading
