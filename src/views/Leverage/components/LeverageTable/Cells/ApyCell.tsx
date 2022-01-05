import React from 'react'
import styled from 'styled-components'
import {
  Text,
  useMatchBreakpoints,
  Skeleton,
  Flex,
  InfoIcon,
  ChevronRightIcon,
  useTooltip,
} from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const ApyCell = ({ apy, yieldFarming, tradingFees, huskyRewards, apyAtOne, borrowingInterest }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const apr = yieldFarming + tradingFees + huskyRewards - borrowingInterest
  const dailyApr = apr / 365
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Yield Farming')}</Text>
        <Text>{yieldFarming?.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Trading Fees')}</Text>
        <Text>{tradingFees.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Huski Rewards')}</Text>
        <Text>{huskyRewards.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Borrowing Interest')}</Text>
        <Text>-{Number(borrowingInterest).toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APR')}</Text>
        <Text>{apr.toFixed(2)}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Total APY')}</Text>
        <Text>{apy}%</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small>{t('Daily APR')}</Text>
        <Text>{dailyApr.toFixed(2)}%</Text>
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )
  return (
    <StyledCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text bold color="textSubtle" textAlign="left">
            {t('APY')}
          </Text>
        )}
        {apy ? (
          <Flex alignItems="center" style={{ marginTop: '17px' }}>
            <Text bold color="text">
              {apyAtOne}%
            </Text>
            <ChevronRightIcon />
            <Text bold fontSize="20px" color="#7B3FE4">
              {apy}%
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="7px" color="textSubtle" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
