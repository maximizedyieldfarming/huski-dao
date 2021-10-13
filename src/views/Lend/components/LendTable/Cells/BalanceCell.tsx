import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import { useGetBnbBalance } from 'hooks/useTokenBalance'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    // align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const BalanceCell = ({ balance, balanceIb, name }) => {
  const { isMobile } = useMatchBreakpoints()
  const userTokenBalance = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))
  const { balance: bnbBalance } = useGetBnbBalance()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Balance
        </Text>
        {balanceIb ? (
          <Text small textAlign="left">
            {userTokenBalance(balanceIb).toNumber().toPrecision(3)} ib{name}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
        {balance ? (
          <Text small textAlign="left">
            {userTokenBalance(name.toLowerCase() === 'bnb' ? bnbBalance : balance)
              .toNumber()
              .toPrecision(3)}{' '}
            {name}
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default BalanceCell
