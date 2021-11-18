import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, useMatchBreakpoints, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import { BIG_ZERO } from 'utils/bigNumber'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
  ${CellContent} {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
`

const NameCell = ({ token }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Box width={40} height={40}>
          <TokenImage token={token?.token} width={40} height={40} mr="8px" />
        </Box>
        <Text bold={!isMobile} small={isMobile} color="secondary">
          {token?.symbol.replace('WBNB', 'BNB')}
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
