import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
    padding-left: 32px;
  }
`
const NameCell = ({ data }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        {/*   <TokenImage token={token?.token} width={40} height={40} mr="8px" /> */}
        <Text bold={!isMobile} small={isMobile}>
          {data.name}
        </Text>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
