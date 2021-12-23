import React, { useRef } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Box } from 'husky-uikit1.0'
import LendRow from './LendRow'
import LendHeaderRow from './LendHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.card.background};
  background-repeat: no-repeat;

  background-position: right;
  background-size: 350px 400px;
  > ${Box}> div:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  }
  > ${Box}> div:first-child {
    // border-bottom:'1px solid #EFEFEF'!important;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    > ${Box}> div {
      border-bottom: none !important;
    }
  }
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

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LendTable = ({ lendData }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
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
