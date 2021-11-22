import { Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'

const BaseCell = styled.div`
  color: black;

  padding: 24px 8px;

  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  justify-content: flex-start;
`

export const CellContent = styled(Flex)`
  flex-direction: row;
  justify-content: left;
  // max-height: 40px;
  ${Text} {
    line-height: 1;
  }
`

export default BaseCell
