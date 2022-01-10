import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text, useMatchBreakpoints, Box } from '@huskifinance/huski-frontend-uikit'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 auto;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 210px;
  }
`

const NameCell = ({ token }) => {
  const { isMobile } = useMatchBreakpoints()
  const exchangeRate = parseInt(token.totalToken) / parseInt(token.totalSupply)

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="left">
          <Box width={44} height={44} pt="2px" ml="8px">
            <TokenImage token={token?.TokenInfo.token} width={44} height={44} />
          </Box>
          <Box>
            <Text bold={!isMobile} small={isMobile} mb="8px" ml="12px" mt="3px" color="text">
              {token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
            </Text>
            {exchangeRate ? (
              <Text
                small
                color="textSubtle"
                fontWeight="500"
                fontSize="12px"
                ml="12px"
                style={{ whiteSpace: 'nowrap' }}
              >
                1 ib{token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')} = {exchangeRate.toFixed(4)}&nbsp;
                {token?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
              </Text>
            ) : (
              <Skeleton width="80px" ml="12px" height="16px" />
            )}
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
