import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { ChevronDownIcon, ChevronUpIcon, Flex, Input, Text, useMatchBreakpoints, Box, Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const LeverageContainer = styled(Flex)`
  border-radius: 10px;
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
export default function LeverageCell({ leverage, onChange }: { leverage: any; onChange: (value: any) => void }) {
  const [lvgValue, setLvgValue] = useState(leverage)
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
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Leverage
          </Text>
        )}
        <LeverageContainer>
          <Flex padding="1rem">
            <Text>{lvgValue.toFixed(2)}</Text>
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
