import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;

  padding: 24px 8px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const CellContent = styled(Flex)`
  // flex-direction: column;
  justify-content: center;
  // max-height: 40px;
  ${Text} {
    line-height: 1;
  }
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    justify-content: unset;
    gap: 2rem;
    // align-items: center;
  }
`

export default BaseCell
