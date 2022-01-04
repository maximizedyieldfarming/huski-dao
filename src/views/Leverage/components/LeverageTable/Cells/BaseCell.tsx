import { Flex, Text } from 'husky-uikit1.0'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const CellContent = styled(Flex)`
  ${Text} {
    line-height: 1;
  }
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: flex-start;
    flex-direction: column;
    justify-content: unset;
  }
`

export default BaseCell
