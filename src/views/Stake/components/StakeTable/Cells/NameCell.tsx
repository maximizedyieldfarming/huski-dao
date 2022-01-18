import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Box } from '@huskifinance/huski-frontend-uikit'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 7rem;
  }
  ${CellContent} {
    flex-direction: row;
  }
`

const NameCell = ({ token }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent alignItems="center">
        <Box width={44} height={44} mr="1rem">
          <TokenImage token={token?.token} width={44} height={44} />
        </Box>
        <Text bold={!isMobile} small={isMobile} color="textFarm">
          {token?.symbol.replace('WBNB', 'BNB')}
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
