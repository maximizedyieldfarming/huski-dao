import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, useMatchBreakpoints, Box, InfoIcon, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage, TokenImage } from 'components/TokenImage'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

interface InfoParams {
  show: boolean
}

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
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

const PoolCell = ({ pool, tokenData, tvl, lpTokens }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const quoteToken = tokenData?.quoteToken
  const token = tokenData?.token
  const [displayInfo, setDisplayInfo] = useState(false)
  const changeDisplayInfo = (e) => setDisplayInfo(!displayInfo)

  // const lpTokensValue = new BigNumber(tokenData?.tokenAmountTotal).times(lpTokens.toNumber())

  const showText = (() => (
    <>
      <Box
        onMouseEnter={changeDisplayInfo}
        onMouseLeave={changeDisplayInfo}
        position="relative"
        style={{ cursor: 'pointer' }}
      >
        <InfoIcon ml="10px" />
        <Info show={displayInfo}>
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
            {token?.busdPrice ? (
              <Text small>
                {token?.symbol}&nbsp;(1&nbsp;{token?.symbol}&nbsp;=&nbsp;{parseFloat(token?.busdPrice).toFixed(2)}
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
            {quoteToken?.busdPrice ? (
              <Text small>
                {quoteToken?.symbol}&nbsp;(1&nbsp;{quoteToken?.symbol}&nbsp;=&nbsp;
                {parseFloat(quoteToken?.busdPrice).toFixed(2)}&nbsp;USD)
              </Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>
        </Info>
      </Box>
    </>
  ))()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={40}
            height={40}
            mr="8px"
          />
          {/*   <Text fontSize="12px" color="textSubtle" textAlign="left">
          Pool
        </Text> */}
          <Flex flex="1">
            <Text bold={!isMobile} small={isMobile} style={{ flex: '1' }}>
              {pool}
            </Text>
            {showText}
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
