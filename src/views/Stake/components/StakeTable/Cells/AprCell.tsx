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
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const AprCell = ({ getApyData }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  const { stakeApr, apy } = getApyData
  console.log('AprCell', getApyData)

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
        <Flex justifyContent="center" alignItems ="center">
          <Text fontSize="12px" color="textSubtle" textAlign="left" mr='5px'>
            {t('APY')}
          </Text>
          <span ref={targetRef}>
            <InfoIcon color="textSubtle" stroke='1px'  />
          </span>
        </Flex>
        {apy ? (
          <Flex alignItems="center">
            <Text color="text" >{apyCell(apy)}</Text>
            {tooltipVisible && tooltip}
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default AprCell
