import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import React from 'react'

const ConverTo = () => {
  return (
    <>
      <Box>
        <Flex justifyContent="space-between">
          <Text>Position ID</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Withdraw</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>PancakeSwap交易手续费</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Total Assets in Position Value</Text>
          <Text>1234</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Debt Value</Text>
          <Text>1234</Text>
        </Flex>
      </Box>
      <Box>
        <Flex justifyContent="space-between">
          <Text>Assets Received</Text>
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

export default ConverTo
