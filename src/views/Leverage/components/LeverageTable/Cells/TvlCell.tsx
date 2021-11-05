import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

import { useTranslation } from 'contexts/Localization'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
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

const TvlCell = ({ tvl, tokenData, lpTokens }) => {
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)
  const { isMobile, isTablet } = useMatchBreakpoints()
  const {tokenPriceUsd, quoteTokenPriceUsd } = tokenData
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text small>TVL</Text>
      {tvl && lpTokens ? (
        <Text>
          {nFormatter(tvl)}&nbsp;({nFormatter(lpTokens.toNumber())}&nbsp;LP Tokens)
        </Text>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
      <Flex alignItems="center">
        <Box width={20} height={20} mr="5px">
          <TokenImage token={token} width={20} height={20} />
        </Box>
        
        {tokenPriceUsd ? (
          <Text small>
            {token?.symbol.replace('wBNB', 'BNB')}&nbsp;(1&nbsp;{token?.symbol.replace('wBNB', 'BNB')}
            &nbsp;=&nbsp;{parseFloat(tokenPriceUsd).toFixed(2)}
            &nbsp;USD)
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex alignItems="center">
        <Box width={20} height={20} mr="5px">
          <TokenImage token={quoteToken} width={20} height={20} />
        </Box>
        {quoteTokenPriceUsd ? (
          <Text small>
            {quoteToken?.symbol.replace('wBNB', 'BNB')}&nbsp;(1&nbsp;{quoteToken?.symbol.replace('wBNB', 'BNB')}
            &nbsp;=&nbsp;
            {parseFloat(quoteTokenPriceUsd).toFixed(2)}&nbsp;USD)
          </Text>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
    </>,
    { placement: 'bottom-start' },
  )

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
          {tvl ? (
            <>
              <Text>{nFormatter(tvl)}</Text>
              {tooltipVisible && tooltip}
              <span ref={targetRef}>
                <InfoIcon ml="10px" />
              </span>
            </>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TvlCell
