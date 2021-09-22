import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

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

const PoolCell = ({ pool, quoteToken, token }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

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
          <Text bold={!isMobile} small={isMobile}>
            {pool}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default PoolCell
