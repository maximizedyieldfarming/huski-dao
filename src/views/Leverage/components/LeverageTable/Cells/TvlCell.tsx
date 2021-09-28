import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, Grid } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
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
  const { isMobile } = useMatchBreakpoints()
  const { quoteToken, token } = tokenData
  console.log({ tokenData })

  const showText = (() => (
    <>
      <Text>{tvl}</Text>
      <Box
        onMouseEnter={changeDisplayInfo}
        onMouseLeave={changeDisplayInfo}
        position="relative"
        style={{ cursor: 'pointer' }}
      >
        <InfoIcon ml="10px" />
        <Info show={displayInfo}>
          <Skeleton width="80px" height="16px" />
          <Flex alignItems="center">
            <Box width={20} height={20} mr="5px">
              <TokenImage token={token} width={20} height={20} />
            </Box>
            <Text small>
              {token?.symbol}&nbsp;(1&nbsp;{token?.symbol}&nbsp;=&nbsp;USD)
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Box width={20} height={20} mr="5px">
              <TokenImage token={quoteToken} width={20} height={20} />
            </Box>
            <Text small>
              {quoteToken?.symbol}&nbsp;(1&nbsp;{quoteToken?.symbol}&nbsp;=&nbsp;USD)
            </Text>
          </Flex>
        </Info>
      </Box>
    </>
  ))()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          TVL
        </Text>
        <Flex alignItems="center">{tvl ? showText : <Skeleton width="80px" height="16px" />}</Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TvlCell
