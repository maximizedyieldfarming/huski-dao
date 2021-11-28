import React from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip, TooltipText } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'

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
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
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
        {apy ? <Text color="text" fontWeight="600" fontSize="16px" mt="8px">{apy}%</Text> : <Text color="text" fontWeight="600" fontSize="16px" mt="8px">236.22%</Text>}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
