import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints, Flex, Grid, Box } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2 0 150px;
  }
  ${Text} {
    white-space: nowrap;
  }
`

const PoolCell = ({ pool, quoteToken, token, exchange }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text color="textSubtle" textAlign="left">
            {t('Pool')}
          </Text>
        )}
        <Grid alignItems="center" gridTemplateColumns="24px 1fr" gridGap={isMobile || isTablet ? "8px" : "1rem"}>
          <TokenPairImage primaryToken={token} secondaryToken={quoteToken} width={24} height={24} mr="8px" />
          <Box>
            <Text color="text" bold={!isMobile} small={isMobile}>
              {pool}
            </Text>
            <Text fontSize="12px" mt="5px" color="textSubtle">
              {exchange}
            </Text>
          </Box>
        </Grid>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
