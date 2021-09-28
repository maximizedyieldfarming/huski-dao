import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { ChevronDownIcon, ChevronUpIcon, Flex, Input, Text, useMatchBreakpoints, Box, Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
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

const LeverageCell = ({ leverage }) => {
  const { isMobile } = useMatchBreakpoints()
  const [lvgValue, setLvgValue] = useState(leverage)
  const increaseLvgValue = (e) => {
    setLvgValue(lvgValue + 0.5)
  }
  const decreaseLvgValue = (e) => {
    setLvgValue(lvgValue - 0.5)
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Leverage
        </Text>
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

export default LeverageCell
