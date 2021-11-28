import { Flex, Text } from 'husky-uikit1.0'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;

  padding: 16px 8px;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items:start;
`

export const CellContent = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  max-height: 40px;
  ${Text} {
    line-height: 1;
    text-align: center;
  }
`

export default BaseCell
