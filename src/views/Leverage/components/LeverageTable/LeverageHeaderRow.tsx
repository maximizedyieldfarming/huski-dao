import React from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Skeleton } from '@pancakeswap/uikit'
import BaseCell, { CellContent } from './Cells/BaseCell'

const StyledRow = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  //cursor: pointer;
`

const NameCell = styled(BaseCell)`
  flex: 5;
  flex-direction: row;
  padding-left: 12px;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 2 0 150px;
    padding-left: 32px;
  }
  ${CellContent} {
    flex: 1;
  }
`
const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`
const LeverageHeaderRow = () => {
  return (
    <StyledRow>
      <NameCell>
        <CellContent>
          <Text small color="textSubtle">
            Pool
          </Text>
        </CellContent>
      </NameCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            APY
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            TVL
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            Borrowing
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent>
          <Text small color="textSubtle">
            Leverage
          </Text>
        </CellContent>
      </StyledCell>
      <StyledCell>
        <CellContent />
      </StyledCell>
    </StyledRow>
  )
}

export default LeverageHeaderRow
