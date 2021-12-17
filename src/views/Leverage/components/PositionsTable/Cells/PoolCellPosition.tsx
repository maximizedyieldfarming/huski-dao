import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints, Flex, Grid } from 'husky-uikit1.0'
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

const PoolCell = ({ pool, quoteToken, token }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent style={{marginTop:'-15px'}}>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Pool')}
          </Text>
        )}
        <Grid style={{marginTop:'5px'}} alignItems="center" gridTemplateColumns="50px 1fr">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={24}
            height={24}
            mr="8px"
            mt='15px'
          />
          <Text color="text" ml='-10px' fontWeight="600" fontSize="16px" bold={!isMobile} small={isMobile}>
            {pool}
          </Text>
          <Text fontSize="12px" color="textSubtle" mt='-5px' style={{marginLeft:'40px'}}>Pancakeswap</Text>
        </Grid>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
