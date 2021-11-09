import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box } from 'husky-uikit'
import { TokenPairImage, TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    justify-content: flex-start;
    align-items: center;
    // padding-left: 32px;
  }
`

const PoolCell = ({ pool, tokenData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Box width={40} height={40} mr="5px">
            <TokenPairImage
              variant="inverted"
              primaryToken={quoteToken}
              secondaryToken={token}
              width={40}
              height={40}
              mr="8px"
            />
          </Box>
          <Text bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }}>
            {pool}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
