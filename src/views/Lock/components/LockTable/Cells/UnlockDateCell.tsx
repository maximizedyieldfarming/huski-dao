import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 3 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      // flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }
  }
`

const UnlockDateCell = ({ date }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('My HUSKI unlock date')}
        </Text>
        <Text>{date}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default UnlockDateCell
