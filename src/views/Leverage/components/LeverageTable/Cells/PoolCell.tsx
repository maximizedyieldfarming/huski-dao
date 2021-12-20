import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box, Grid } from 'husky-uikit1.0'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  justify-content: flex-start;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
    flex: 1 0 150px;
    align-items: center;
    // padding-left: 32px;
  }
`

const PoolCell = ({ pool, tokenData }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  return (
    <StyledCell role="cell">
      <CellContent>
        <Grid gridTemplateColumns="24px 1fr" gridGap="1rem">
          <TokenPairImage
            primaryToken={token}
            secondaryToken={quoteToken}
            width={24}
            height={24}
            mr="1rem"
          />
          <Box>
            <Text mt="-3px" bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }} color="text">
              {pool}
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
