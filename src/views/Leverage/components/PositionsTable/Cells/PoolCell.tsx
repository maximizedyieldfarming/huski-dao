import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  // flex: 1;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    // flex: 1 0 150px;
    padding-left: 32px;
  }
  ${Text} {
    white-space: nowrap;
  }
`

const PoolCell = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text bold={!isMobile} small={isMobile}>
          {pool}
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
