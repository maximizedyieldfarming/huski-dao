import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text, useMatchBreakpoints, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 4 0 150px;
    justify-content: flex-start;
    align-items: center;
    // padding-left: 32px;
  }
`

const NameCell = ({ token }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const exchangeRate = parseInt(token.totalToken) / parseInt(token.totalSupply)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Box width={40} height={40} mr="5px">
            <TokenImage token={token?.TokenInfo.token} width={40} height={40} mr="8px" />
          </Box>
          <Box>
            <Text bold={!isMobile} small={isMobile} mb="5px">
              {token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
            </Text>
            {exchangeRate ? (
              <Text small color="textSubtle">
                1 ib{token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')} = {exchangeRate.toFixed(4)}&nbsp;
                {token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
              </Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
