import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Box, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCakeVault } from 'state/pools/hooks'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { TokenPairImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'
import tier1icon from '../../../assets/tier1icon.png'
import tier2icon from '../../../assets/tier2icon.png'
import tier3icon from '../../../assets/tier3icon.png'
import tier4icon from '../../../assets/tier4icon.png'
import tier5icon from '../../../assets/tier5icon.png'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    padding-left: 32px;
  }
  ${Text}:last-child {
    font-size: 24px;
    font-weight: bold;
    color: #9615e7;
    text-transform: capitalize;
  }
`
const tierIcon = (tier) => {
  let icon
  if (tier === 'tier 1') {
    icon = tier1icon
  } else if (tier === 'tier 2') {
    icon = tier2icon
  } else if (tier === 'tier 3') {
    icon = tier3icon
  } else if (tier === 'tier 4') {
    icon = tier4icon
  } else {
    icon = tier5icon
  }

  return icon
}

const TierCell = ({ tier }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <img src={tierIcon(tier)} alt="" />
          <Box>
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              Tier
            </Text>
            <Text bold={!isMobile} small={isMobile}>
              {tier}
            </Text>
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TierCell
