import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
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
    align-items: end;
    ${({ theme }) => theme.mediaQueries.md} {
      // flex-direction: column;
      justify-content: end;
      gap: 1rem;
    }
  }
`

const RewardsCell = ({ rewards }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('HUSKI Rewards')}
        </Text>
        <Text color='textSecondary' fontWeight="700">0.234</Text>
      </CellContent>
    </StyledCell>
  )
}

export default RewardsCell
