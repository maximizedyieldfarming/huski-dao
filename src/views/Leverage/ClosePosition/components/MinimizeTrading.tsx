import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import React from 'react'

const MinimizeTrading = ({ data }) => {
  return (
    <>
      <Text small color="textSubtle">
        We will convert the minimum required amount of tokens into ETH to pay back the debt and return the remaining
        assets to you. This can potentially save on slippage and trading fees.
      </Text>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>Position Value Asset</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Amount to Trade</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Price Impact</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Trading Fees</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Converted Position Value Assets</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Debt Value</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will recelve approximately</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Received</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button>Close Position</Button>
      </Flex>
    </>
  )
}

export default MinimizeTrading
