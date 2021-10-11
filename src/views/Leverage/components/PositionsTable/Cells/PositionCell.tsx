import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon } from '@pancakeswap/uikit'
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

const PositionCell = ({ position }) => {
  const { isMobile } = useMatchBreakpoints()
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            Position
          </Text>
          <Tooltip>
            <Text>Position value = Debt Value + Equity Value + Yield Current yield: 0.01BNB</Text>
          </Tooltip>
        </Flex>
        {position ? <Text>{position}</Text> : <Skeleton width="80px" height="16px" />}
      </CellContent>
    </StyledCell>
  )
}

export default PositionCell
