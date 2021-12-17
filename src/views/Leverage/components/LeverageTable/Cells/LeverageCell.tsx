import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { ChevronDownIcon, ChevronUpIcon, Flex, Input, Text, useMatchBreakpoints, Box, Button } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`
const LeverageContainer = styled(Flex)`
  border-radius: 10px;
  height:40px;
  text-align: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const CustomButton = styled(Button)`
  border-radius: 0;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 0;
  &:first-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

// const LeverageCell = ({ leverage }) => {
export default function LeverageCell({ leverage, onChange, childLeverage }: { leverage: any; onChange: (value: any) => void;  childLeverage: any }) {
  const [lvgValue, setLvgValue] = useState(childLeverage)
 React.useEffect(() => {
  
      setLvgValue(childLeverage)
  }, [childLeverage])
  // const increaseLvgValue = (e) => {
  //   setLvgValue(lvgValue + 0.5)
  // }
  // const decreaseLvgValue = (e) => {
  //   setLvgValue(lvgValue - 0.5)
  // }

  const increaseLvgValue = useCallback(() => {
    const input = lvgValue + 0.5
    setLvgValue(input)
    onChange(input)
  }, [lvgValue, onChange])
  const decreaseLvgValue = useCallback(() => {
    const input = lvgValue - 0.5
    setLvgValue(input)
    onChange(input)
  }, [lvgValue, onChange])

  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent >
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Leverage')}
          </Text>
        )}
        <LeverageContainer>
          <Flex padding="1rem">
            <Text color='text' fontWeight="500">{lvgValue?.toFixed(2)}</Text>
          </Flex>
          <Flex flexDirection="column">
            <CustomButton scale="xs" variant="secondary" onClick={increaseLvgValue} disabled={lvgValue === leverage}>
              <ChevronUpIcon />
            </CustomButton>
            <CustomButton scale="xs" variant="secondary" onClick={decreaseLvgValue} disabled={lvgValue === 1}>
              <ChevronDownIcon />
            </CustomButton>
          </Flex>
        </LeverageContainer>
      </CellContent>
    </StyledCell>
  )
}

// export default LeverageCell
