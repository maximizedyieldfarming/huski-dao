import React from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  useTooltip,
  InfoIcon,
  AutoRenewIcon,
} from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { TokenImage } from 'components/TokenImage'
import { useWeb3React } from '@web3-react/core'
import { useHistory } from 'react-router-dom'
import { TRADE_FEE } from 'config'
import { getPriceImpact } from '../../helpers'

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
  const history = useHistory()

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
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyWithdrawMinimizeTrading
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
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyWithdrawMinimizeTrading
    contract = quoteTokenVaultContract
  }

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()

  let amountToTrade = 0
  let convertedPositionValueToken
  let tokenReceive = 0
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    amountToTrade = 0
  } else {
    amountToTrade =
      ((basetokenBegin * farmingtokenBegin) / (basetokenBegin - Number(debtValueNumber) + Number(baseTokenAmount)) -
        farmingtokenBegin) /
      (1 - TRADE_FEE)
  }
  const convertedPositionValue = Number(farmTokenAmount) - amountToTrade
  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    convertedPositionValueToken = baseTokenAmount
  } else {
    convertedPositionValueToken = debtValueNumber
  }

  if (Number(baseTokenAmount) >= Number(debtValueNumber)) {
    tokenReceive = Number(convertedPositionValueToken) - Number(debtValueNumber)
  } else {
    tokenReceive = 0
  }

  const priceImpact = getPriceImpact(data.farmData, amountToTrade, symbolName)
  const tradingFees = Number(amountToTrade) * TRADE_FEE

  const [isPending, setIsPending] = React.useState(false)
  const { account } = useWeb3React()
  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    setIsPending(true)
    try {
      toastInfo(t('Closing Position...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your position was closed successfully'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder

    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const {
    targetRef: positionValueRef,
    tooltip: positionValueTooltip,
    tooltipVisible: positionValueTooltipVisible,
  } = useTooltip(
    <>
      <Text bold>{t('Total value of your farming position calculated from PancakeSwap pool’s reserve.')}</Text>
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
        <Flex justifyContent="space-between" flexWrap="wrap">
          <Box>
            <Flex mb="10px">
              <Text>{t('Position Value Assets')}</Text>
              {positionValueTooltipVisible && positionValueTooltip}
              <span ref={positionValueRef}>
                <InfoIcon ml="10px" mt="2px" />
              </span>
            </Flex>
            <BusdPriceContainer flexWrap="wrap">
              <Flex alignItems="center" mb="10px">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={TokenInfo?.token} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}&nbsp;=&nbsp;
                  {new BigNumber(tokenPriceUsd).toFixed(2, 1)}&nbsp;
                  {TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')}
                </Text>
              </Flex>
              <Flex alignItems="center" mb="10px">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={TokenInfo?.quoteToken} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')}&nbsp;=&nbsp;
                  {new BigNumber(quoteTokenPriceUsd).toFixed(2, 1)}&nbsp;
                  {TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')}
                </Text>
              </Flex>
            </BusdPriceContainer>
          </Box>
          {baseTokenAmount ? (
            <Text bold>
              {new BigNumber(farmTokenAmount).lt(0.001)
                ? new BigNumber(farmTokenAmount).toFixed(6, 1)
                : new BigNumber(farmTokenAmount).toFixed(3, 1)}{' '}
              {quoteTokenValueSymbol} +{' '}
              {new BigNumber(baseTokenAmount).lt(0.001)
                ? new BigNumber(baseTokenAmount).toFixed(6, 1)
                : new BigNumber(baseTokenAmount).toFixed(3, 1)}{' '}
              {tokenValueSymbol}
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
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          <Text bold>
            {amountToTrade.toPrecision(4)} {quoteTokenValueSymbol}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Price Impact')}</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactRef}>
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          <Text bold>{new BigNumber(priceImpact).toPrecision(3, 1)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Trading Fees')}</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesRef}>
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          <Text bold>{new BigNumber(tradingFees).toPrecision(3, 1)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>{t('Converted Position Value Assets')}</Text>
            {convertedPositionValueTooltipVisible && convertedPositionValueTooltip}
            <span ref={convertedPositionValueRef}>
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          {convertedPositionValue ? (
            <Text bold>
              {new BigNumber(convertedPositionValue).lt(0.001)
                ? new BigNumber(convertedPositionValue).toFixed(6, 1)
                : new BigNumber(convertedPositionValue).toFixed(3, 1)}{' '}
              {quoteTokenValueSymbol} +{' '}
              {new BigNumber(convertedPositionValueToken).lt(0.001)
                ? new BigNumber(convertedPositionValueToken).toFixed(6, 1)
                : new BigNumber(convertedPositionValueToken).toFixed(3, 1)}{' '}
              {tokenValueSymbol}{' '}
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
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          <Text bold>
            {new BigNumber(debtValueNumber).toFixed(3)} {tokenValueSymbol}{' '}
          </Text>
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>{t('You will receive approximately')}</Text>
          {convertedPositionValue ? (
            <Text bold>
              {new BigNumber(convertedPositionValue).lt(0.001)
                ? new BigNumber(convertedPositionValue).toFixed(6, 1)
                : new BigNumber(convertedPositionValue).toFixed(3, 1)}{' '}
              {quoteTokenValueSymbol} +{' '}
              {new BigNumber(tokenReceive).lt(0.001)
                ? new BigNumber(tokenReceive).toFixed(6, 1)
                : new BigNumber(tokenReceive).toFixed(3, 1)}{' '}
              {tokenValueSymbol}
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
              <InfoIcon ml="10px" mt="2px" />
            </span>
          </Flex>
          {convertedPositionValue ? (
            <Text bold>
              {new BigNumber(convertedPositionValue).lt(0.001)
                ? new BigNumber(convertedPositionValue).times(0.995).toFixed(6, 1)
                : new BigNumber(convertedPositionValue).times(0.995).toFixed(3, 1)}{' '}
              {quoteTokenValueSymbol} +{' '}
              {new BigNumber(tokenReceive).lt(0.001)
                ? new BigNumber(tokenReceive).toFixed(6, 1)
                : new BigNumber(tokenReceive).toFixed(3, 1)}{' '}
              {tokenValueSymbol}
            </Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="center">
          <Button
            onClick={handleConfirm}
            width="300px"
            height="60px"
            disabled={!account || isPending}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
          >
            {isPending ? t('Closing Position') : t('Close Position')}
          </Button>
        </Flex>
      </Section>
    </>
  )
}

export default CloseEntirePosition
