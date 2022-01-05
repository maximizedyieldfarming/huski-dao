import React, { useRef } from 'react'
import styled from 'styled-components'
import StakeRow from './StakeRow'

const StyledTable = styled.div`
  // border-radius: ${({ theme }) => theme.radii.card};

  // background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    // border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  // border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  // padding: 1px 1px 3px 1px;
  // background-size: 400% 400%;
`


const StakeTable = ({ stakeData }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {stakeData.map((token) => (
          <StakeRow tokenData={token} key={token?.pid} />
        ))}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default StakeTable
