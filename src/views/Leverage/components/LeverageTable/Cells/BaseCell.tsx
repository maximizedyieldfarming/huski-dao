import { Flex, Text } from 'husky-uikit1.0'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;

  padding: 24px 8px;

  display: flex;
  flex-direction: column;
  align-items:start;
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
  align-items: start;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
    justify-content: unset;
  }
`

export default BaseCell
