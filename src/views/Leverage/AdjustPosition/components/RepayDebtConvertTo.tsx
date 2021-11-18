import React from 'react'
import { Box, Flex, Text, WarningIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { usePercentageToCloseContext } from '../context'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
  convertToValues: any
  quoteTokenName: string
  tokenName: string
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

const RepayDebtConvertTo: React.FC<Props> = ({
  currentPositionLeverage,
  targetPositionLeverage,
  convertToValues,
  tokenName,
  quoteTokenName,
}) => {
  const { needCloseBase, needCloseFarm, remainBase, remainFarm, remainBorrowBase, remainBorrowFarm, remainLeverage } =
    convertToValues

  const { percentage, setPercentage } = usePercentageToCloseContext()
  return (
    <Wrapper>
      <GrayBox>
        <WarningIcon />
        <Text color="textSubtle">
          Your position value will all be converted to {tokenName} and returned to you after paying back the debt.
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
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              style={{ width: '90%' }}
              list="percentageToClose"
            />
            <datalist id="percentageToClose">
              <option value="0" label="0%" />
              <option value="50" label="50%" />
              <option value="100" label="100%" />
            </datalist>
            <Text ml="auto">{percentage}%</Text>
          </Flex>
        </Box>
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          <Text>Position Value Assets to Close</Text>
        </Box>
        <Text>
          {needCloseFarm?.toFixed(3)} {quoteTokenName} + {needCloseBase?.toFixed(3)} {tokenName}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Updated Position Value Assets</Text>
        <Flex>
          <Text color="textSubtle">
            {remainFarm?.toFixed(3)} {quoteTokenName} + {remainBase?.toFixed(3)} {tokenName}
          </Text>
          <ChevronRightIcon />
          <Text>
            {remainBorrowFarm?.toFixed(3)} {quoteTokenName} + {remainBorrowBase?.toFixed(3)} {tokenName}
          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default RepayDebtConvertTo
