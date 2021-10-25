import React from 'react'
import { Box, Button, Flex, Text, Skeleton, useTooltip, InfoIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
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
const CloseEntirePosition = ({
  data,
  baseTokenAmount,
  farmTokenAmount,
  tradingFees,
  debtValue,
  priceImpact,
  token,
  quoteToken,
}) => {
  const { busdPrice: tokenBusdPrice, symbol: tokenName } = token
  const { busdPrice: quoteTokenBusdPrice, symbol: quoteTokenName } = quoteToken
  const { t } = useTranslation()
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const vaultAddress = getAddress(data.farmData.vaultAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()


  const handleFarm = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    try {
      const tx = await callWithGasPrice(vaultContract, 'work', [id, workerAddress, amount, loan, maxReturn, dataWorker], callOptions)
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
  console.info('data', data);
  const handleConfirm = async () => {
    const id = data.positionId
    const workerAddress = getAddress(data.farmData.workerAddress)
    const AssetsBorrowed = debtValue || 0
    const amount = 0 // getDecimalAmount(new BigNumber(tokenInput), 18).toString()// basetoken input
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()// Assets Borrowed
    const maxReturn = 0

    const abiCoder = ethers.utils.defaultAbiCoder;
    const withdrawMinimizeTradingAddress = getAddress(data.farmData.strategies.withdrawMinimizeTrading)
    const dataStrategy = 1 // abiCoder.encode(['uint256'], [minFarmingToken]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy]);

    console.log({ id, workerAddress, amount, loan, maxReturn, dataWorker, withdrawMinimizeTradingAddress, dataStrategy });
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const { tokenAmountTotal, quoteTokenAmountTotal } = data.farmData
  const basetokenBegin = parseInt(tokenAmountTotal)
  const farmingtokenBegin = parseInt(quoteTokenAmountTotal)
  const amountToTrade = (basetokenBegin * farmingtokenBegin / (basetokenBegin - debtValue + Number(baseTokenAmount)) - farmingtokenBegin) / (1 - 0.0025)
  const convertedPositionValue = Number(farmTokenAmount) - amountToTrade

  console.log({ amountToTrade });


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
                  <TokenImage token={quoteToken} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{quoteTokenName.replace('wBNB', 'BNB')}&nbsp;=&nbsp;{quoteTokenBusdPrice}&nbsp;BUSD{' '}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={token} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{tokenName.replace('wBNB', 'BNB')}&nbsp;=&nbsp;{tokenBusdPrice}&nbsp;BUSD
                </Text>
              </Flex>
            </BusdPriceContainer>
          </Box>
          {baseTokenAmount ? (
            <Text>
              {Number(farmTokenAmount).toPrecision(4)} {quoteTokenName} + {Number(baseTokenAmount).toPrecision(4)}{' '} {tokenName}
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
          {amountToTrade ? <Text>{amountToTrade.toPrecision(4)}{quoteTokenName}</Text> : <Skeleton height="16px" width="80px" />}
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
          {convertedPositionValue ? <Text>{Number(convertedPositionValue).toPrecision(4)} {quoteTokenName} + {Number(debtValue).toPrecision(4)} {tokenName} </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Debt Value</Text>
            {debtValueTooltipVisible && debtValueTooltip}
            <span ref={debtValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {debtValue ? <Text>{debtValue.toPrecision(4)}{tokenName} </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {convertedPositionValue ? <Text>{Number(convertedPositionValue).toPrecision(4)} {quoteTokenName} + {0.00} {tokenName}    </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Minimum Received</Text>
            {minimumReceivedTooltipVisible && minimumReceivedTooltip}
            <span ref={minimumReceivedRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {convertedPositionValue ? <Text>{(Number(convertedPositionValue) * 0.995).toPrecision(4)} {quoteTokenName} + {0.00} {tokenName}     </Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button onClick={handleConfirm}>Close Position</Button>
      </Section>
    </>
  )
}

export default CloseEntirePosition
