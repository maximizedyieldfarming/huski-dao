import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
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

const ApyCell = ({ apy, huskyRewards, apr, borrowingInterest, liquidityRewards, tradingFeesRewards }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Apy
          </Text>
          <Tooltip isTop>
            <Flex justifyContent="space-between">
              <Text small>Pancake Liquitity Rewards:</Text>
              {liquidityRewards ? <Text small>{liquidityRewards}%</Text> : <Skeleton width="80px" height="16px" />}
            </Flex>
            <Flex justifyContent="space-between">
              <Text small>Pancake Trading Fee Rewards:</Text>
              {tradingFeesRewards ? <Text small>{tradingFeesRewards}%</Text> : <Skeleton width="80px" height="16px" />}
            </Flex>
            <Flex justifyContent="space-between">
              <Text small>Huski Token Rewards:</Text>
              {huskyRewards ? (
                <Text small>{huskyRewards.toPrecision(3)}%</Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Text small>Borrowing Interest:</Text>
              {borrowingInterest ? (
                <Text small>{borrowingInterest?.toPrecision(3)}%</Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Text small>APR:</Text>
              {apr ? <Text small>{apr}%</Text> : <Skeleton width="80px" height="16px" />}
            </Flex>
            <Flex justifyContent="space-between">
              <Text small>APY:</Text>
              {apy ? <Text small>{apy}%</Text> : <Skeleton width="80px" height="16px" />}
            </Flex>
          </Tooltip>
        </Flex>
        {apy ? <Text>{apy}%</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
