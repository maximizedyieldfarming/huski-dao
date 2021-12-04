import React, { useState } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Skeleton, Text, useMatchBreakpoints, Box, Flex, InfoIcon, useTooltip } from 'husky-uikit1.0'
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
    flex: 1 0 150px;
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

const TvlCell = ({ tvl, tokenData, lpTokens, tokenNum, quoteTokenNum }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const { tokenPriceUsd, quoteTokenPriceUsd } = tokenData
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token
  const { t } = useTranslation()
  console.log({ tokenNum, quoteTokenNum })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text small>{t('TVL')}</Text>
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
        <Text small mx="5px">{nFormatter(tokenNum.toNumber())}</Text>
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
        <Text small mx="5px">{nFormatter(quoteTokenNum.toNumber())}</Text>
        {' '}
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
            {t('TVL')}
          </Text>
        )}
        {/*         <Flex alignItems="center">{tvl ? showText : <Skeleton width="80px" height="16px" />}</Flex> */}
        <Flex alignItems="center" style={{ marginTop: '15px' }}>
          {tvl ? (
            <>
              <Text color="text" fontWeight="600">
                {nFormatter(tvl)}
              </Text>
              {tooltipVisible && tooltip}
              <span ref={targetRef}>
                <InfoIcon ml="7px" color="textSubtle" />
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
