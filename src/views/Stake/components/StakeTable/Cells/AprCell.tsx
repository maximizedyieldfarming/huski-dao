import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const AprCell = ({ getApyData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { t } = useTranslation()

  const { stakeApr, apy } = getApyData
  // console.log('AprCell', getApyData)

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APR')}
        </Text>
        <Text>{apyCell(stakeApr)}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Text small mr="10px">
          {t('Total APY')}
        </Text>
        <Text>{apyCell(apy)}</Text>
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize={isMobile || isTablet ? "1rem" : "12px"} color="textSubtle" textAlign="left" mb="auto">
          {t('APY')}
        </Text>
        {apy ? (
          <Flex alignItems="center">
            <Text>{apyCell(apy)}</Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
