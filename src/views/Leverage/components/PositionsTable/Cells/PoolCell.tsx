import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints, Flex, Grid } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
flex: 1 0 50px;
${({ theme }) => theme.mediaQueries.md} {
  flex: 1 0 120px;
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
        <Grid style={{marginTop:'5px'}} alignItems="center" gridTemplateColumns="50px 1fr">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={24}
            height={24}
            mr="8px"
          />
          <Text color="text" style={{marginLeft:'-10px'}} fontWeight="700" fontSize="16px" bold={!isMobile} small={isMobile}>
            {pool}
          </Text>
          <Text fontSize="12px" style={{marginLeft:'40px'}}>Pancakeswap</Text>
        </Grid>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
