import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
 
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 100px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      // flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
    }
  }
`

const UnlockDateCell = ({ date }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="16px" color="textSubtle" textAlign="left">
          {t('My HUSKI unlock date')}
        </Text>
        <Text>{date}</Text>
        <Text fontWeight='600'>July 13th, 2020</Text>
      </CellContent>
    </StyledCell>
  )
}

export default UnlockDateCell
