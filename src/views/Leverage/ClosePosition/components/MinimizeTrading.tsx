import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Text, Skeleton, Input } from '@pancakeswap/uikit'
import styled from 'styled-components'

const GrayBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
`
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

const MinimizeTrading = ({ data, isCloseEntire }) => {
  // FIX: for scroll-wheel changing input of number type
  // using this method the problem won't happen
  const numberInputRef = useRef([])
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const references = numberInputRef.current
    references.forEach((reference) => reference.addEventListener('wheel', handleWheel))

    return () => {
      references.forEach((reference) => reference.removeEventListener('wheel', handleWheel))
    }
  }, [])

  const [percentagePositionValueToClose, setPercentagePositionValueToClose] = useState(0)
  const handlePercentagePositionValueSlider = (e) => {
    const value = e?.target?.value
    setPercentagePositionValueToClose(value)
  }

  const [closedAmountToUse, setClosedAmountToUse] = useState(0)
  const handleClosedAmountToUseSlider = (e) => {
    const value = () => {
      if (e?.target?.value === '') return 0
      if (e?.target?.value > 100) return 100
      return e?.target?.value
    }

    console.log({ value })
    setClosedAmountToUse(value)
  }

  const ClosePartial = (
    <>
      <Section flexDirection="column">
        <Text bold>What percentage of position value would you like to close?(aka withdraw collateral)</Text>
        <Flex>
          <input
            type="range"
            min="0.0"
            max="100"
            step=".1"
            value={percentagePositionValueToClose}
            onChange={handlePercentagePositionValueSlider}
          />
          <Input
            type="number"
            placeholder="0.00"
            value={percentagePositionValueToClose}
            onChange={handlePercentagePositionValueSlider}
            ref={(input) => numberInputRef.current.push(input)}
            style={{ flexBasis: '15%' }}
          />
        </Flex>
        <Text color="failure">
          You must partially close enough of your position to get your position’s debt ratio below the maximum allowed
          when partially closing a position, which is 0.0622ETH + 219.27BTCB (~18.85%) of your current position value.{' '}
        </Text>
        <Box>
          <Flex justifyContent="space-between">
            <Text>Position Value Assets to Close</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>Updated Position Value Assets</Text>
          </Flex>
        </Box>
      </Section>

      <Section flexDirection="column">
        <Box>
          <Text bold>How much of the closed amount would you like to use for debt repayment?</Text>
          <Flex>
            <input
              type="range"
              min="0.0"
              max="100"
              step=".1"
              value={closedAmountToUse}
              onChange={handleClosedAmountToUseSlider}
            />
            <Input
              type="number"
              placeholder="0.00"
              value={closedAmountToUse}
              onChange={handleClosedAmountToUseSlider}
              ref={(input) => numberInputRef.current.push(input)}
              style={{ flexBasis: '15%' }}
            />
          </Flex>
        </Box>
        <Box>
          <Text bold>Amount of Debt to Repay</Text>
          <Input type="number" placeholder="0.00" ref={(input) => numberInputRef.current.push(input)} />
          <Text color="failure">
            You must repay enough debt to lower your position’s Debt Ratio below the maximum allowed when partially
            closing a position on this pool.In this case, you must repay 0.1119ETH (~108.85%) of the closed amount.
          </Text>
        </Box>
        <Text color="textSubtle">
          If you’d like to return all of the debt. You can visit the Close Your EntirePosition page and fully close your
          position.
        </Text>
      </Section>

      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>Updated Debt Value</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Debt Ratio(Leverage)</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Updated Safety Buffer</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Yield Farm APR</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Trading Fees APR (3-day avg.)</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>HUSKI Rewards APR</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Borrowing Interest APR</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Total APR</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Total APY</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
      </Section>

      <Section flexDirection="column">
        <Text bold>Summary</Text>
        <Flex justifyContent="space-between">
          <Text>Total Assets in Position Value</Text>
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
          <Text>Amount of Debt to Repay</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text bold>You will receive approximately</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Received</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button mx="auto">Partial Close Value</Button>
        <Text color="failure" mx="auto">
          Minimum Partial Close Value:
        </Text>
      </Section>
    </>
  )

  const CloseEntire = (
    <>
      <Section flexDirection="column">
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
      </Section>
      <Section flexDirection="column">
        <Flex justifyContent="space-between">
          <Text>You will recelve approximately</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Minimum Received</Text>
          {!data ? <Text>1234</Text> : <Skeleton height="16px" width="80px" />}
        </Flex>
        <Button>Close Position</Button>
      </Section>
    </>
  )

  return (
    <>
      <GrayBox background="backgroundDisabled">
        <Text small color="textSubtle">
          We will convert the minimum required amount of tokens into ETH to pay back the debt and return the remaining
          assets to you. This can potentially save on slippage and trading fees.
        </Text>
      </GrayBox>
      {isCloseEntire ? CloseEntire : ClosePartial}
    </>
  )
}

export default MinimizeTrading
