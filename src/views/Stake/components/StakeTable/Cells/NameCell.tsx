import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 150px;
    // padding-left: 32px;
  }
  ${CellContent} {
    align-items: unset;
  }
`

const NameCell = ({ token }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems="center">
          <Box width="2rem" height="2rem" mr="1rem">
            <TokenImage token={token?.token} width={40} height={40} />
          </Box>
          <Text bold={!isMobile} small={isMobile} color="secondary">
            {token?.symbol.replace('WBNB', 'BNB')}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
