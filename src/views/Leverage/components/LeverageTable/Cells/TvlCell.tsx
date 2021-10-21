import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, Grid } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

interface InfoParams {
  show: boolean
}

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

const Info = styled(Box)<InfoParams>`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  flex-direction: column;
  position: absolute;
  top: 2rem;
  right: 2px;
  ${({ theme }) => theme.mediaQueries.xl} {
    right: unset;
    left: 50%;
    transform: translate(-50%, 0);
  }
  padding: 1rem;
  gap: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.default};
  z-index: ${({ theme }) => theme.zIndices.modal};
  ${Text} {
    word-wrap: break-word;
    word-break: keep-all;
  }
  // width: max-content;
  > ${Flex} {
    gap: 10px;
  }
`

const TvlCell = ({ tvl, tokenData }) => {
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { quoteToken, token } = tokenData

  return (
    <StyledCell role="cell">
      <CellContent>
        {(isMobile || isTablet) && (
          <Text fontSize="12px" color="textSubtle" textAlign="left">
            TVL
          </Text>
        )}
        {/*         <Flex alignItems="center">{tvl ? showText : <Skeleton width="80px" height="16px" />}</Flex> */}
        <Flex alignItems="center">
          {tvl ? <Text>{nFormatter(tvl)}</Text> : <Skeleton width="80px" height="16px" />}
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TvlCell
