import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import React from 'react'

const MinimizeTrading = () => {
  return (
    <>
      <Box>
        <Text>
          We will convert the minimum required amount of tokens into ETH to pay back the debt and return the remaining
          assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </Box>
      <Box>
        <Flex justifyContent="space-between">
          <Text>Position Value Asset</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Amount to Trade</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Price Impact and Trading Fees</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Converted Position Value Assets</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Debt Value</Text>
          <Text>1234</Text>
        </Flex>
      </Box>
      <Box>
        <Flex justifyContent="space-between">
          <Text>You will recelve approximately</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Received</Text>
          <Text>1234</Text>
        </Flex>
        <Button>Close Position</Button>
      </Box>
    </>
  )
}

export default MinimizeTrading
