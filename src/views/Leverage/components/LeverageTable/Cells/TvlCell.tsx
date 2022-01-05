import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useMatchBreakpoints, Flex, InfoIcon, useTooltip, Grid } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
`

const TvlCell = ({ tvl, tokenData, lpTokens, tokenNum, quoteTokenNum }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const { tokenPriceUsd, quoteTokenPriceUsd } = tokenData
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token
  const { t } = useTranslation()

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
      <Grid alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="20px 1fr 1fr">
        <TokenImage token={token} width={20} height={20} />
        <Flex>
          <Text small mx="5px">
            {nFormatter(tokenNum.toNumber())}
          </Text>
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
      </Grid>
      <Grid alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="20px 1fr 1fr">
        <TokenImage token={quoteToken} width={20} height={20} />
        <Flex>
          <Text small mx="5px">
            {nFormatter(quoteTokenNum.toNumber())}
          </Text>
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
      </Grid>
    </>,
    { placement: 'bottom-start' },
  )

  return (
    <StyledCell role="cell">
      <CellContent>
        {isSmallScreen && (
          <Text bold color="textSubtle" textAlign="left">
            {t('TVL')}
          </Text>
        )}
        {tvl ? (
          <Flex alignItems="center" style={{ marginTop: '17px' }}>
            <Text bold color="text">
              {nFormatter(tvl)}
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon ml="7px" color="textSubtle" />
            </span>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TvlCell
