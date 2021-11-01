import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: column;
    }
  }
`

const BalanceCell = ({ balance, balanceIb, name }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const userTokenBalance = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))
  const { balance: bnbBalance } = useGetBnbBalance()

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            My Balance
          </Text>
        )}
        {balanceIb ? (
          <Box>
            <Text small textAlign="left">
              {userTokenBalance(balanceIb).toNumber().toPrecision(3)} ib{name}
            </Text>
            <Text small textAlign="left" color="textSubtle">
              {userTokenBalance(name.toLowerCase() === 'bnb' ? bnbBalance : balance)
                .toNumber()
                .toPrecision(3)}{' '}
              {name}
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
