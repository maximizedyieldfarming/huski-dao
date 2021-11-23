import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box, InfoIcon, Skeleton, useTooltip } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { TokenPairImage, TokenImage } from 'components/TokenImage'
import nFormatter from 'utils/nFormatter'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  align-itmes:start;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 200px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
  }
`

const PoolCell = ({ pool, tokenData, tvl, lpTokens }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <TokenPairImage
            variant="inverted"
            primaryToken={quoteToken}
            secondaryToken={token}
            width={24}
            height={24}
            mr="8px"
          />
          {/*   {(isMobile || isTablet) && (
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              Pool
            </Text>
          )} */}
          <Flex flex="1" alignItems="center">
            <Text bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }}>
              {pool}
            </Text>
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
