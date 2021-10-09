import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Text, useMatchBreakpoints, Skeleton, Box, Flex, InfoIcon } from '@pancakeswap/uikit'
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

const AprCell = ({ apy }) => {
  const { isMobile } = useMatchBreakpoints()

  const apyCell = (e) => {
    const value = e * 100
    return `${value.toFixed(2)}%`
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Apy
        </Text>
        {apy ? (
          <Flex alignItems="center">
            <Text>{apyCell(apy)}</Text>
            <Tooltip>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Total&nbsp;APR</Text>
                <Skeleton width="80px" height="16px" />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text small>Total&nbsp;APY</Text>
                <Text>{apyCell(apy)}</Text>
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

export default AprCell
