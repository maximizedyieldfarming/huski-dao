import { Box, Button, Flex, Text, Skeleton, InfoIcon, useTooltip } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import Tooltip from 'components/Tooltip'
import { TokenImage } from 'components/TokenImage'

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
  const { totalPositionValueInUSD, debtValue } = data
  const { tradeFee, leverage } = data.farmData
  const { busdPrice: tokenBusdPrice, symbol: token } = data.farmData.token
  const { busdPrice: quoteTokenBusdPrice, symbol: quoteToken } = data.farmData.quoteToken

  const totalPositionValue = new BigNumber(Number(totalPositionValueInUSD.hex) / tokenBusdPrice).dividedBy(
    BIG_TEN.pow(18),
  )
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const tradingFees = Number(tradeFee) * Number(leverage) * 365
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
                  <TokenImage token={data.farmData.quoteToken} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{quoteToken.replace('wBNB', 'BNB')}&nbsp;=&nbsp;{quoteTokenBusdPrice}&nbsp;BUSD{' '}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Box width={18} height={18} mr="5px">
                  <TokenImage token={data.farmData.token} width={20} height={20} />
                </Box>
                <Text small color="textSubtle">
                  1&nbsp;{token.replace('wBNB', 'BNB')}&nbsp;=&nbsp;{tokenBusdPrice}&nbsp;BUSD
                </Text>
              </Flex>
            </BusdPriceContainer>
          </Box>
          {totalPositionValue ? (
            <Text>{totalPositionValue.toNumber().toPrecision(3)}</Text>
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
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
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
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Debt Value</Text>
            {debtValueTooltipVisible && debtValueTooltip}
            <span ref={debtValueRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {debtValueNumber ? <Text>{debtValueNumber.toFixed(3)}</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Minimum Received</Text>
            {minimumReceivedTooltipVisible && minimumReceivedTooltip}
            <span ref={minimumReceivedRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button>Close Position</Button>
      </Section>
    </>
  )
}

export default ConverTo
