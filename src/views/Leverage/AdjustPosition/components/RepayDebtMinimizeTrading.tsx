import React, { useState } from 'react'
import { Box, Button, Flex, Radio, Slider, Text, Skeleton, Input, WarningIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
}

const Wrapper = styled(Box)`
  margin-top: 1rem;
  > ${Flex}, ${Box} {
    &:not(:first-child) {
      padding: 1rem 0;
    }
  }
`

const GrayBox = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.card};
`
const RepayDebtMinimizeTrading: React.FC<Props> = ({ currentPositionLeverage, targetPositionLeverage }) => {
  const [percentageToClose, setPercentageToClose] = useState<number>(0)
  return (
    <Wrapper>
      <GrayBox>
        <WarningIcon />
        <Text color="textSubtle">
          We will convert the minimum required amount of tokens into xx to pay back the debt and return the remaining
          assets to you. This can potentially saveon slippage and trading fees.
        </Text>
      </GrayBox>
      {(currentPositionLeverage === 1 || targetPositionLeverage === 1) && (
        <Box>
          <Text>
            What percentage of position value would you like to close?{' '}
            {currentPositionLeverage !== 1 && '(After repay all debt)'}
          </Text>
          <Flex>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={percentageToClose}
              onChange={(e) => setPercentageToClose(Number(e.target.value))}
              style={{ width: '90%' }}
              list="percentageToClose"
            />
            <datalist id="percentageToClose">
              <option value="0" label="0%" />
              <option value="50" label="50%" />
              <option value="100" label="100%" />
            </datalist>
            <Text ml="auto">{percentageToClose}%</Text>
          </Flex>
        </Box>
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text>Position Value Assets to Close</Text>
        </Box>
        <Text>xx</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Updated Position Value Assets</Text>
        <Text>xx</Text>
      </Flex>
    </Wrapper>
  )
}

export default RepayDebtMinimizeTrading
