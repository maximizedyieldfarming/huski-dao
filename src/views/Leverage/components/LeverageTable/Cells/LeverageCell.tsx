import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  Text,
  useMatchBreakpoints,
  Button,
} from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  padding: 10px 0px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 0px;
    flex: 1 0 120px;
  }
`
const LeverageContainer = styled(Flex)`
  border-radius: 10px;
  height: 40px;
  text-align: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.lvgBorder};
`

const CustomButton = styled(Button)`
  border-radius: 0;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.lvgBorder};
  padding: 0;
  &:first-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lvgBorder};
  }
`

export default function LeverageCell({
  leverage,
  onChange,
  childLeverage,
}: {
  leverage: any
  onChange: (value: any) => void
  childLeverage: any
}) {
  const [lvgValue, setLvgValue] = useState(childLeverage)
  React.useEffect(() => {
    setLvgValue(childLeverage)
  }, [childLeverage])

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
  const isSmallScreen = isMobile || isTablet
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text color="textSubtle" textAlign="left">
            {t('Leverage')}
          </Text>
        )}
        <LeverageContainer alignItems="start">
          <Flex padding="1rem">
            <Text color="text" fontWeight="500">
              {lvgValue?.toFixed(2)}
            </Text>
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
