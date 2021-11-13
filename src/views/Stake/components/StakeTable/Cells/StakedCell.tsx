import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from '@pancakeswap/uikit'
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
    ${({ theme }) => theme.mediaQueries.lg} {
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
  }
`

const StakedCell = ({ staked, name }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {name.toLowerCase().includes(' lp') ? t('Total Volume staked:') : t(`${name.replace('WBNB', 'BNB')} staked:`)}
        </Text>
        <Text>{staked}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default StakedCell
