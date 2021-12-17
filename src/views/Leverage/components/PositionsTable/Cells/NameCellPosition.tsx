import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const NameCell = ({ name, positionId }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent >
      <Text color="text" fontWeight="600" fontSize="16px" bold={!isMobile} small={isMobile}>
          {name}
        </Text>
        <Text color="textSubtle" fontSize="12px" mt="8px">#{positionId}</Text>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
