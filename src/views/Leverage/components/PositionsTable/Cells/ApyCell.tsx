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

const ApyCell = ({ apy }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex>
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Apy
          </Text>
          <Tooltip>
            <Text>
              Pancake Liquitity Rewards: 23.36% Pancake Trading Fee Rewards: 11.23% Huski Token Rewards: 45.36%
              Borrowing Interest: 23.36% APR: 156.23% APY: 256.23%
            </Text>
          </Tooltip>
        </Flex>
        {apy ? <Text>{apy?.toFixed(3)}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default ApyCell
