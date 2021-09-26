import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import React from 'react'

const ConverTo = ({ data }) => {
  return (
    <>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>Position ID</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Withdraw</Text>
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
          <Text>Total Assets in Position Value</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Debt Value</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Flex>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>Assets Received</Text>
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

export default ConverTo
