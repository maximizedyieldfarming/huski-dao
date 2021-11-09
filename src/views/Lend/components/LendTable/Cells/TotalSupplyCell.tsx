import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import nFormatter from 'utils/nFormatter'
import { formatBigNumber } from 'state/utils'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 1 0 120px;
  }
 
`

const TotalSupplyCell = ({ supply, supplyUSD }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const formatedSupply = supply && Number(formatBigNumber(supply).replace(/,/g, ''))
  const formatedSupplyUSD = supplyUSD && Number(formatBigNumber(supplyUSD).replace(/,/g, ''))
  const { t } = useTranslation()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('Total Supply')}
          </Text>
        )}
        {supply ? (
          <Box>
            <Text>{nFormatter(formatedSupply)}</Text>
            <Text small color="textSubtle">{`($${nFormatter(formatedSupplyUSD)})`}</Text>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalSupplyCell
