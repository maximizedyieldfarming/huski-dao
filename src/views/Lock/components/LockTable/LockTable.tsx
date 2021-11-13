import React, { useRef } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import LockRow from './LockRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  // background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    // border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
    margin-bottom: 1rem;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const LockTable = ({ data }) => {
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
        {data?.map((token) => (
          <LockRow lockData={token} key={token.pid} />
        ))}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LockTable
