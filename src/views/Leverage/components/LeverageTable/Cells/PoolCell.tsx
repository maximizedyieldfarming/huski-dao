import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box } from 'husky-uikit1.0'
import { TokenPairImage, TokenImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
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

const PoolCell = ({ pool, tokenData,}) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const quoteToken = tokenData?.TokenInfo.quoteToken
  const token = tokenData?.TokenInfo.token

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="start" mt="18px">
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
          <Flex flex="1" alignItems="start" flexDirection="column">
            <Text mt='-3px' bold={!isMobile} small={isMobile} style={{ whiteSpace: 'nowrap' }} color="text">
              {pool}
            </Text>
            <Text fontSize="12px"  mt='5px' color="textSubtle">Pancakeswap</Text>
          </Flex>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
