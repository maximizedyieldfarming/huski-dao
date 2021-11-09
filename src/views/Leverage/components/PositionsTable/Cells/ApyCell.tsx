import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const ApyCell = ({ apy, huskyRewards, apr, borrowingInterest, liquidityRewards, tradingFeesRewards }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between">
        <Text small>{t('Pancake Liquitity Rewards:')}</Text>
        {liquidityRewards ? <Text small>{liquidityRewards}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Pancake Trading Fee Rewards:')}</Text>
        {tradingFeesRewards ? <Text small>{tradingFeesRewards}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Huski Token Rewards:')}</Text>
        {huskyRewards ? <Text small>{huskyRewards.toPrecision(4)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Borrowing Interest:')}</Text>
        {borrowingInterest ? (
          <Text small>{borrowingInterest?.toPrecision(4)}%</Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APR:')}</Text>
        {apr ? <Text small>{apr}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('APY:')}</Text>
        {apy ? <Text small>{apy}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
    </>,
    { placement: 'top-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('APY')}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        )}
        {apy ? <Text>{apy}%</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
