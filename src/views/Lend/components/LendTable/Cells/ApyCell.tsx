import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  // flex: 1 0 50px;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.lg} {
    // flex: 1 0 120px;
  }
  /* ${CellContent} {
    flex-direction: row;
    justify-content: flex-start;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: column;
    }
  } */
`

const ApyCell = ({ getApyData, token }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }
  const { lendApr, stakeApr, totalApr, apy } = getApyData
  const tokenName = token?.token?.symbol

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Lending APR')}
        </Text>
        {lendApr ? <Text>{apyCell(lendApr)}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Staking APR')}
        </Text>
        {stakeApr ? <Text>{apyCell(stakeApr.toNumber())}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      {tokenName === 'ALPACA' && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text small mr="8px">
            {t('Protocol APR')}
          </Text>
          <Skeleton width="80px" height="16px" />
        </Flex>
      )}
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Total APR')}
        </Text>
        {totalApr ? <Text>{apyCell(totalApr.toNumber())}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="8px">
          {t('Total APY')}
        </Text>
        {apy ? <Text>{apyCell(apy)}</Text> : <Skeleton width="80px" height="16px" />}
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            {t('APY')}
          </Text>
        )}
        {apy ? (
          <Flex alignItems="center">
            <Text style={{ fontWeight: 600, fontSize: '16px' }} color="text">
              {apyCell(apy)}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="5px" color="textSubtle" />
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
