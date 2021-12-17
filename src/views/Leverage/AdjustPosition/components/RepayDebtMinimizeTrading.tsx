import React from 'react'
import { Box, Flex, Text, WarningIcon, ChevronRightIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { usePercentageToCloseContext } from '../context'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
  minimizeTradingValues: any
  quoteTokenName: string
  tokenName: string
  baseTokenAmountValue: any
  farmTokenAmountValue: any
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
const RepayDebtMinimizeTrading: React.FC<Props> = ({
  currentPositionLeverage,
  targetPositionLeverage,
  minimizeTradingValues,
  quoteTokenName,
  tokenName,
  baseTokenAmountValue,
  farmTokenAmountValue
}) => {
  const { needCloseBase, needCloseFarm, remainBase, remainFarm } =
    minimizeTradingValues
const {t} = useTranslation()
  const { percentage, setPercentage } = usePercentageToCloseContext()

  return (
    <Wrapper>
      <GrayBox>
        <WarningIcon />
        <Text color="textSubtle">
          {t('We will convert the minimum required amount of tokens into %tokenName% to pay back the debt and return the remaining assets to you. This can potentially save on slippage and trading fees.', { tokenName })}
        </Text>
      </GrayBox>
      {(currentPositionLeverage === 1 || targetPositionLeverage === 1) && (
        <Box>
          <Text>
            {t('What percentage of position value would you like to close?')}{' '}
            {currentPositionLeverage !== 1 && t('(After repay all debt)')}
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
              className="unstyledRangeInput" // TODO: leave this className, at least until theres a better looking one with proper functionality. because we need to see it for testing
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
          <Text>{t('Position Value Assets to Close')}</Text>
        </Box>
        <Text>
          {needCloseFarm?.toFixed(3)} {quoteTokenName} + {needCloseBase?.toFixed(3)} {tokenName}
        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>{t('Updated Position Value Assets')}</Text>
        <Flex>
          <Text color="textSubtle">
            {farmTokenAmountValue?.toFixed(3)} {quoteTokenName} + {baseTokenAmountValue?.toFixed(3)} {tokenName}
          </Text>
          <ChevronRightIcon />
          <Text>
            {remainFarm?.toFixed(3)} {quoteTokenName} + {remainBase?.toFixed(3)} {tokenName}
          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default RepayDebtMinimizeTrading
