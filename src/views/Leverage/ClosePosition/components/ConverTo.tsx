import { Box, Button, Flex, Text, Skeleton, InfoIcon, useTooltip } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TokenImage } from 'components/TokenImage'
import { getPriceImpact } from '../../helpers'

const Section = styled(Flex)`
  &:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  }
  > ${Flex}, > ${Box} {
    padding: 1rem 0;
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

const ConverTo = ({ data }) => {
  const { positionId, debtValue, lpAmount, vault } = data
  const {
    TokenInfo,
    QuoteTokenInfo,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    tradeFee,
    leverage,
    lptotalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
  } = data.farmData

  const { t } = useTranslation()
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenVaultAddress = TokenInfo?.vaultAddress
  const quoteTokenVaultAddress = QuoteTokenInfo?.vaultAddress
  const vaultContract = useVault(tokenVaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  let symbolName
  let tokenValue
  let quoteTokenValue
  let tokenPrice
  let quoteTokenPrice
  let tokenValueSymbol
  let quoteTokenValueSymbol
  let baseTokenAmount
  let farmTokenAmount
  let basetokenBegin
  let farmingtokenBegin
  let workerAddress
  let withdrawMinimizeTradingAddress
  let contract

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    tokenValue = TokenInfo?.token
    quoteTokenValue = TokenInfo?.quoteToken
    tokenPrice = tokenPriceUsd
    quoteTokenPrice = quoteTokenPriceUsd
    tokenValueSymbol = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyLiquidate
    contract = vaultContract
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    tokenValue = TokenInfo?.quoteToken
    quoteTokenValue = TokenInfo?.token
    tokenPrice = quoteTokenPriceUsd
    quoteTokenPrice = tokenPriceUsd
    tokenValueSymbol = TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyLiquidate
    contract = quoteTokenVaultContract
  }

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const convertedPositionValueAssets =
    Number(baseTokenAmount) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - 0.0025) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  const priceImpact = getPriceImpact(data.farmData, farmTokenAmount, symbolName)
  const tradingFees = Number(farmTokenAmount) * 0.0025

  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    try {
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessfulll'), t('Something went wrong your farm request. Please try again...'))
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minbasetoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder
    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minbasetoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])
    // console.log({symbolName, id, workerAddress, amount, loan,convertedPositionValue,withdrawMinimizeTradingAddress, minbasetoken, maxReturn, dataWorker})
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
      <Text>{t('The amount that will be traded to BNB based on your selected method.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: priceImpactRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Impact to price due to trade size.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('PancakeSwap trading fees')}</Text>
      <Text>{t('HUSKI trading fees')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: convertedPositionValueRef,
    tooltip: convertedPositionValueTooltip,
    tooltipVisible: convertedPositionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Assets you will have after converting the required amount into BNB')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: debtValueRef,
    tooltip: debtValueTooltip,
    tooltipVisible: debtValueTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Debt Value = Borrowed Asset + Borrowing Interest')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: minimumReceivedRef,
    tooltip: minimumReceivedTooltip,
    tooltipVisible: minimumReceivedTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t('Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.')}
      </Text>
    </>,
    { placement: 'top-start' },
  )
  return (
    <>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Box>
            <Flex>
              <Text>{t('Position Value Assets')}</Text>
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
                  1&nbsp;{quoteTokenValueSymbol}&nbsp;=&nbsp;{quoteTokenPrice}&nbsp;{quoteTokenValueSymbol}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={tokenValue} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{tokenValueSymbol}&nbsp;=&nbsp;{tokenPrice}&nbsp;{quoteTokenValueSymbol}
                </Text>
              </Flex>
            </BusdPriceContainer>
          </Box>
          {data ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol} +{' '}
              {Number(baseTokenAmount).toPrecision(4)} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Amount to Trade')}</Text>
            {amountToTradeTooltipVisible && amountToTradeTooltip}
            <span ref={amountToTradeRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {data ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Price Impact')}</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text>{priceImpact.toPrecision(3)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Trading Fees')}</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          <Text>{tradingFees.toPrecision(3)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Converted Position Value Assets')}</Text>
            {convertedPositionValueTooltipVisible && convertedPositionValueTooltip}
            <span ref={convertedPositionValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {convertedPositionValueAssets ? (
            <Text>
              {convertedPositionValueAssets.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Debt Value')}</Text>
            {debtValueTooltipVisible && debtValueTooltip}
            <span ref={debtValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {debtValueNumber ? (
            <Text>
              {debtValueNumber.toFixed(3)} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>{t('You will receive approximately')}</Text>
          {convertedPositionValue ? (
            <Text>
              {Number(convertedPositionValue).toPrecision(4)} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Minimum Received')}</Text>
            {minimumReceivedTooltipVisible && minimumReceivedTooltip}
            <span ref={minimumReceivedRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {convertedPositionValue ? (
            <Text>
              {(Number(convertedPositionValue) * 0.995).toPrecision(4)} {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Button onClick={handleConfirm}>{t('Close Position')}</Button>
      </Section>
    </>
  )
}

export default ConverTo
