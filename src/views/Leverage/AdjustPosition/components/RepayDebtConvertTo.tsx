import React from 'react'
import { Box, Flex, Text, InfoIcon, ChevronRightIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { usePercentageToCloseContext } from '../context'

interface Props {
  currentPositionLeverage: number
  targetPositionLeverage: number
  convertToValues: any
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

const RepayDebtConvertTo: React.FC<Props> = ({
  currentPositionLeverage,
  targetPositionLeverage,
  convertToValues,
  tokenName,
  quoteTokenName,
  baseTokenAmountValue,
  farmTokenAmountValue
}) => {
  const { needCloseBase, needCloseFarm, remainBase, remainFarm } =
    convertToValues

  const { t } = useTranslation()
  const { percentage, setPercentage } = usePercentageToCloseContext()
  return (
    <Wrapper>
      <GrayBox background="#F7F7F8!important">
        <InfoIcon mr = "10px"/>
        <Text color="textSubtle" small>
          {t(`Your position value will all be converted to ${tokenName} and returned to you after paying back the debt.`)}
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
        <Flex>
          <Text>{t('Position Value Assets to Close')}</Text>
          <InfoIcon ml="10px" />
        </Flex>
        <Text bold>
          {needCloseFarm?.toFixed(3)} {quoteTokenName} + {needCloseBase?.toFixed(3)} {tokenName}


        </Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <Text>{t('Updated Position Value Assets')}</Text>
          <InfoIcon ml="10px" />
        </Flex>
        <Flex>
          <Text color="textSubtle" bold>
            {farmTokenAmountValue?.toFixed(3)} {quoteTokenName} + {baseTokenAmountValue?.toFixed(3)} {tokenName}
          </Text>
          <ChevronRightIcon style={{ fontWeight: "bold" }} />
          <Text bold>
            {remainFarm?.toFixed(3)} {quoteTokenName} + {remainBase?.toFixed(3)} {tokenName}

          </Text>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default RepayDebtConvertTo
