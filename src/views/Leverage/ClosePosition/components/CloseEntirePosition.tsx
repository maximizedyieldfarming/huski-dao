import React from 'react'
import { Box, Button, Flex, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Tooltip from 'components/Tooltip'

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
const CloseEntirePosition = ({
  totalPositionValue,
  tradingFees,
  debtValue,
  amountToTrade,
  priceImpact,
  convertedPositionValue,
}) => {
  return (
    <>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Position Value Assets</Text>
            <Tooltip isLeft>
              <Text>Total value of your farming position calculated from PancakeSwap pool’s reserve.</Text>
            </Tooltip>
          </Flex>
          {totalPositionValue ? (
            <Text>{totalPositionValue.toNumber().toPrecision(3)}</Text>
          ) : (
            <Skeleton height="16px" width="80px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Amount to Trade</Text>
            <Tooltip isLeft>
              <Text>The amount that will be traded to BNB based on your selected method.</Text>
            </Tooltip>
          </Flex>
          {amountToTrade ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            <Tooltip isLeft>
              <Text>Impact to price due to trade size.</Text>
            </Tooltip>
          </Flex>
          {priceImpact ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            <Tooltip isLeft>
              <Text>PancakeSwap trading fees</Text>
            </Tooltip>
          </Flex>
          {tradingFees ? <Text>{tradingFees.toPrecision(3)}</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Converted Position Value Assets</Text>
            <Tooltip isLeft>
              <Text>Assets you will have after converting the required amount into BNB</Text>
            </Tooltip>
          </Flex>
          {convertedPositionValue ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Debt Value</Text>
            <Tooltip isLeft>
              <Text>Debt Value = Borrowed Asset + Borrowing Interest</Text>
            </Tooltip>
          </Flex>
          {debtValue ? <Text>{debtValue.toPrecision(3)}</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will receive approximately</Text>
          {convertedPositionValue ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Minimum Received</Text>
            <Tooltip isLeft>
              <Text>
                Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.
              </Text>
            </Tooltip>
          </Flex>
          {convertedPositionValue ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button>Close Position</Button>
      </Section>
    </>
  )
}

export default CloseEntirePosition
