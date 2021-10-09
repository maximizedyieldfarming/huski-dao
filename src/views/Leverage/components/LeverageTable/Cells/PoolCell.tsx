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
import Tooltip from 'components/Tooltip'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 150px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
  }
`

const PoolCell = ({ pool, tokenData, tvl, lpTokens }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const quoteToken = tokenData?.quoteToken
  const token = tokenData?.token

  // const lpTokensValue = new BigNumber(tokenData?.tokenAmountTotal).times(lpTokens.toNumber())

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
          <Flex flex="1" alignItems="center">
            <Text bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }}>
              {pool}
            </Text>
            <Tooltip>
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
            </Tooltip>
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
