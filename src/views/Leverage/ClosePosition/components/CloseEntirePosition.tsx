import React from 'react'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers';
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TokenImage } from 'components/TokenImage'

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
const BusdPriceContainer = styled(Flex)`
  > ${Flex} {
    padding: 0 5px;
    &:first-child {
      border-right: 1px solid ${({ theme }) => theme.colors.text};
    }
    &:last-child {
      border-left: 1px solid ${({ theme }) => theme.colors.text};
    }
  }
`
const CloseEntirePosition = ({ data }) => {
  const { positionId, debtValue, lpAmount, vault } = data
  const { quoteToken, token, TokenInfo, QuoteTokenInfo, tradeFee, leverage, lptotalSupply, tokenAmountTotal, quoteTokenAmountTotal } = data.farmData
  let symbolName;
  let tokenValue;
  let quoteTokenValue;
  let tokenValueSymbol;
  let quoteTokenValueSymbol;
  let baseTokenAmount;
  let farmTokenAmount;
  let basetokenBegin;
  let farmingtokenBegin;
  let workerAddress;
  let withdrawMinimizeTradingAddress;

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    tokenValue = token;
    quoteTokenValue = quoteToken;
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyWithdrawMinimizeTrading

  } else {
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    tokenValue = quoteToken;
    quoteTokenValue = token;
    tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyWithdrawMinimizeTrading

  }


  const tradingFees = Number(tradeFee) * Number(leverage) * 365
  const priceImpact = Number(tradeFee) * Number(leverage) * 365
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  // const { busdPrice: tokenBusdPrice, symbol: tokenName } = token
  // const { busdPrice: quoteTokenBusdPrice, symbol: quoteTokenName } = quoteToken

  // const { tokenAmountTotal, quoteTokenAmountTotal } = data.farmData
  // const basetokenBegin = parseInt(tokenAmountTotal)
  // const farmingtokenBegin = parseInt(quoteTokenAmountTotal)
  const amountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) - farmingtokenBegin) / (1 - 0.0025)
  const convertedPositionValue = Number(farmTokenAmount) - amountToTrade

  const { t } = useTranslation()
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const vaultAddress = (data.farmData.TokenInfo.vaultAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    try {
      const tx = await callWithGasPrice(vaultContract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    // const workerAddress = getAddress(data.farmData.workerAddress)
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256;
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder;
    // const withdrawMinimizeTradingAddress = getAddress(data.farmData.strategies.withdrawMinimizeTrading)
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy]);

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }


  const {
    targetRef: positionValueRef,
    tooltip: positionValueTooltip,
    tooltipVisible: positionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>Total value of your farming position calculated from PancakeSwap pool’s reserve.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: amountToTradeRef,
    tooltip: amountToTradeTooltip,
    tooltipVisible: amountToTradeTooltipVisible,
  } = useTooltip(
    <>
      <Text>The amount that will be traded to BNB based on your selected method.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: priceImpactRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>Impact to price due to trade size.</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>PancakeSwap trading fees</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: convertedPositionValueRef,
    tooltip: convertedPositionValueTooltip,
    tooltipVisible: convertedPositionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>Assets you will have after converting the required amount into BNB</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: debtValueRef,
    tooltip: debtValueTooltip,
    tooltipVisible: debtValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>Debt Value = Borrowed Asset + Borrowing Interest</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: minimumReceivedRef,
    tooltip: minimumReceivedTooltip,
    tooltipVisible: minimumReceivedTooltipVisible,
  } = useTooltip(
    <>
      <Text>Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.</Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Box>
            <Flex>
              <Text>Position Value Assets</Text>
              {positionValueTooltipVisible && positionValueTooltip}
              <span ref={positionValueRef}>
                <InfoIcon ml="10px" />
              </span>
            </Flex>
            <BusdPriceContainer>
              <Flex alignItems="center">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={quoteTokenValue} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{quoteTokenValueSymbol}&nbsp;=&nbsp;{quoteTokenValue.busdPrice}&nbsp;{symbolName}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={tokenValue} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{tokenValueSymbol}&nbsp;=&nbsp;{tokenValue.busdPrice}&nbsp;{symbolName}
                </Text>
              </Flex>
            </BusdPriceContainer>
          </Box>
          {baseTokenAmount ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol} + {Number(baseTokenAmount).toPrecision(4)}{' '} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Amount to Trade</Text>
            {amountToTradeTooltipVisible && amountToTradeTooltip}
            <span ref={amountToTradeRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {amountToTrade ? <Text>{amountToTrade.toPrecision(4)}{quoteTokenValueSymbol}</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {priceImpact ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {tradingFees ? <Text>{tradingFees.toPrecision(3)}</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Converted Position Value Assets</Text>
            {convertedPositionValueTooltipVisible && convertedPositionValueTooltip}
            <span ref={convertedPositionValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {convertedPositionValue ? <Text>{Number(convertedPositionValue).toPrecision(4)} {quoteTokenValueSymbol} + {Number(debtValueNumber).toPrecision(4)} {tokenValueSymbol} </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Debt Value</Text>
            {debtValueTooltipVisible && debtValueTooltip}
            <span ref={debtValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {debtValueNumber ? <Text>{debtValueNumber.toPrecision(4)}{tokenValueSymbol} </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {convertedPositionValue ? <Text>{Number(convertedPositionValue).toPrecision(4)} {quoteTokenValueSymbol} + {0.00} {tokenValueSymbol}    </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Minimum Received</Text>
            {minimumReceivedTooltipVisible && minimumReceivedTooltip}
            <span ref={minimumReceivedRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {convertedPositionValue ? <Text>{(Number(convertedPositionValue) * 0.995).toPrecision(4)} {quoteTokenValueSymbol} + {0.00} {tokenValueSymbol}     </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button onClick={handleConfirm}>Close Position</Button>
      </Section>
    </>
  )
}

export default CloseEntirePosition
