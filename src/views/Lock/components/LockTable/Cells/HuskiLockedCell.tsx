import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
margin-top : 15px;
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: end;
    ${({ theme }) => theme.mediaQueries.md} {
      // flex-direction: column;
      justify-content: end;
      gap: 1rem;
    }
  }
`

const HuskiLockedCell = ({ sHuskiLocked }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="16px" color="textSubtle" textAlign="left">
          {t('sHUSKI Locked-')}
        </Text>
        <Text fontWeight='600' color='text'>{sHuskiLocked}</Text>
        <Text fontWeight='600' color='text'>44.03</Text>
      </CellContent>
    </StyledCell>
  )
}

export default HuskiLockedCell
