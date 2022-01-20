import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@huskifinance/huski-frontend-uikit'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 5rem;
  }
  ${Text} {
    font-family: 'GenJyuuGothic';
  }
`

const BalanceCell = ({ balance, balanceIb, name, decimals }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const formatedBalance = formatDisplayedBalance(balance, decimals)
  const ibFormatedBalance = formatDisplayedBalance(balanceIb, decimals)

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('My Balance')}
          </Text>
        )}
        {balanceIb ? (
          <Box>
            <Text small textAlign="left" fontSize="12px" bold style={{ marginBottom: '7px' }}>
              {ibFormatedBalance} ib{name}
            </Text>
            <Text small textAlign="left" fontSize="12px" bold color="text">
              {formatedBalance} {name}
            </Text>
          </Box>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default BalanceCell
