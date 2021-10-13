import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton, Box, Flex, InfoIcon, ChevronRightIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
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

const ApyCell = ({ apy, yieldFarming, tradingFees, huskyRewards, apyAtOne, borrowingInterest }) => {
  const { isMobile } = useMatchBreakpoints()

  const tradingFeesNumber = Number(tradingFees) * 365
  const huskyRewardsNumber = Number(huskyRewards) * 100
  console.log('yield farming', yieldFarming)
  const BorrowingInterestNumber = new BigNumber(borrowingInterest).div(BIG_TEN.pow(18)).toNumber() * 100
  console.log('borrowingInterestNumber', BorrowingInterestNumber)
  const apr = Number(yieldFarming) + tradingFeesNumber + huskyRewardsNumber - Number(BorrowingInterestNumber)
  const dailyApr = apr / 365

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          APY
        </Text>
        {apy ? (
          <Flex alignItems="center">
            <Text color="textSubtle">{apyAtOne}%</Text>
            <ChevronRightIcon />
            <Text bold>{apy}%</Text>
            <Tooltip>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Yield&nbsp;Farming</Text>
                <Text>{yieldFarming?.toFixed(2)}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Trading&nbsp;Fees</Text>
                <Text>{tradingFeesNumber.toFixed(2)}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>HUSKY&nbsp;Rewards</Text>
                <Text>{huskyRewardsNumber.toFixed(2)}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Borrowing&nbsp;Interest</Text>
                <Text>-{Number(BorrowingInterestNumber).toFixed(2)}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Total&nbsp;APR</Text>
                <Text>{apr.toFixed(2)}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Total&nbsp;APY</Text>
                <Text>{apyAtOne}%</Text>
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Daily&nbsp;APR</Text>
                <Text>{dailyApr.toFixed(2)}%</Text>
              </Flex>
            </Tooltip>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
