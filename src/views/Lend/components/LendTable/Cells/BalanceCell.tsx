import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceAmount, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { useTranslation } from 'contexts/Localization'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 1 0 120px;
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
        {balanceIb && balance && !Number.isNaN(Number(ibFormatedBalance)) && !Number.isNaN(formatedBalance) ? (
          <Box>
            <Text small textAlign="left">
              {ibFormatedBalance} ib{name}
            </Text>
            <Text small textAlign="left" color="textSubtle">
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
