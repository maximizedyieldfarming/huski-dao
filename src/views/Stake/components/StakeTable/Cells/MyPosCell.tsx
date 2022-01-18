import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@huskifinance/huski-frontend-uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 6rem;
  }
`

const MyPosCell = ({ staked, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  const { t } = useTranslation()
  // const formatedSupply = supply && Number(formatBigNumber(supply).replace(/,/g, ''))

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={isMobile || isTablet ? '1rem' : '12px'} color="textSubtle" textAlign="left">
          {t('My Position')}
        </Text>
        {staked ? (
          <Text marginTop={isMobile || isTablet ? '0px' : '10px'} fontSize="18px" fontWeight="700" color="secondary">
            {new BigNumber(staked).toFixed(3, 1)} {name}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" marginTop={isMobile || isTablet ? '0px' : '10px'}/>
        )}
      </CellContent>
    </StyledCell>
  )
}

export default MyPosCell
