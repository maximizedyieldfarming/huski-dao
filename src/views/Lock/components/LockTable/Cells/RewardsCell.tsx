import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  margin-top: 15px;
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
      gap: 2.5rem;
    }
  }
`

const RewardsCell = ({ rewards }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="16px" color="textSubtle" textAlign="left">
          {t('HUSKI Rewards')}
        </Text>
        <Text fontWeight="700" color="#7B3FE4">
          0.234
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default RewardsCell
