import React from 'react'
import styled from 'styled-components'
import { Flex, Text, useMatchBreakpoints } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
 
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 1 0 120px;
    
  }
`
const NameCell = ({ data }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <CellContent>
        <Flex alignItems='center'>
          {/* <TokenImage token={token?.token} width={40} height={40} mr="8px" /> */}
          <img width='44px' src="/images/lock/sHuski.png" alt="" />
          <Text color="text" fontWeight="600" bold={!isMobile} small={isMobile} ml='15px'> 
            {data.name}
          </Text>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default NameCell
