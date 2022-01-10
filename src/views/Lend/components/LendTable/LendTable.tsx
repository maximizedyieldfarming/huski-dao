import React from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Box } from '@huskifinance/huski-frontend-uikit'
import LendRow from './LendRow'
import LendHeaderRow from './LendHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.card.background};
  // > ${Box}> div:not(:last-child) {
  //   border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  // }
  > ${Box}> div:first-child {
    // border-bottom:'1px solid #EFEFEF'!important;
  }
  // ${({ theme }) => theme.mediaQueries.lg} {
  //   > ${Box}> div {
  //     border-bottom: none !important;
  //   }
  // }
  > ${Box} {
    overflow: auto;
    ::-webkit-scrollbar {
      height: 8px;
    }
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1px 1px 1px 1px;
  background-size: 400% 400%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const LendTable = ({ lendData }) => {
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledTableBorder>
      <StyledTable role="table">
        <Box>
          {!(isMobile || isTablet) && <LendHeaderRow />}
          {lendData.map((token) => (
            <LendRow tokenData={token} key={token?.pid} />
          ))}
        </Box>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LendTable
