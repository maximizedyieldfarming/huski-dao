import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints, Flex, Grid } from '@pancakeswap/uikit'
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
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const PoolCell = ({ pool, quoteToken, token }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Pool')}
          </Text>
        )}
        <Grid alignItems="center" gridTemplateColumns="50px 1fr">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={40}
            height={40}
            mr="8px"
          />
          <Text bold={!isMobile} small={isMobile}>
            {pool}
          </Text>
        </Grid>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
