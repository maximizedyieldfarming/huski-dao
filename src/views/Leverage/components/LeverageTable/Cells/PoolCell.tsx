import React from 'react'
import styled from 'styled-components'
import {  Text, useMatchBreakpoints, Box, Grid } from '@huskifinance/huski-frontend-uikit'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 9rem;
    padding: 0px 0px 0px 10px;
    align-items: center;
  }
`

const PoolCell = ({ pool, tokenData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  return (
    <StyledCell role="cell">
      <CellContent>
        <Grid alignItems="center" gridTemplateColumns="24px 1fr" gridGap={isMobile || isTablet ? "8px" : "1rem"}>
          <TokenPairImage
            primaryToken={token}
            secondaryToken={quoteToken}
            width={24}
            height={24}
            mr="1rem"
          />
          <Box>
            <Text bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }} color="text">
              {pool.toUpperCase().replace('WBNB', 'BNB')}
            </Text>
            <Text fontSize="12px" mt="5px" color="textSubtle">
              {tokenData?.lpExchange}
            </Text>
          </Box>
        </Grid>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
