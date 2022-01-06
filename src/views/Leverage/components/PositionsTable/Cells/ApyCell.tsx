import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  useTooltip,
  TooltipText,
} from '@huskifinance/huski-frontend-uikit'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const ApyCell = ({ apy, huskyRewards, apr, dailyApr, borrowingInterest, yieldFarming, tradingFees }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Yield Farming APR:')}</Text>
        {yieldFarming ? <Text small>{yieldFarming.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Trading Fees APR:')}</Text>
        {tradingFees ? <Text small>{tradingFees.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current HUSKI Rewards APR')}</Text>
        {huskyRewards ? <Text small>{huskyRewards.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Current Borrowing Interest APR:')}</Text>
        {borrowingInterest ? (
          <Text small>-{borrowingInterest?.toFixed(2)}%</Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Total APR:')}</Text>
        {apr ? <Text small>{apr.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Daily APR:')}</Text>
        {apr ? <Text small>{dailyApr.toFixed(2)}%</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between">
        <Text small>{t('Total APY:')}</Text>
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
            <Text color="textSubtle" textAlign="left">
              {t('APY')}
            </Text>
          </Flex>
        )}
        {apy ? (
          <Flex alignItems="center">
            <Text bold>
              {apy}%
            </Text>
            {tooltipVisible && tooltip}
            {/* <span ref={targetRef} style={{marginTop: "8px"}}>
              <InfoIcon ml="10px" />
            </span> */}
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
