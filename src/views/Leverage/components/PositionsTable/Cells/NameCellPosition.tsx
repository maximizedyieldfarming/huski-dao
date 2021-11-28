import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 0.2 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 0.2 0 80px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
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
