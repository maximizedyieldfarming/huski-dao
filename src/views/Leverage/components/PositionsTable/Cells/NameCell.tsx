import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints, Box } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const NameCell = ({ name, positionId }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Box>
          <Text bold={!isMobile} small={isMobile}>
            {name}
          </Text>
          <Text color="textSubtle" fontSize={isMobile || isTablet ? null : '12px'} mt="8px">
            #{positionId}
          </Text>
        </Box>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
