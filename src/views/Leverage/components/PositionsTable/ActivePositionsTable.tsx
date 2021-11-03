import React, { useRef } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ActivePositionsRow from './ActivePositionsRow'
import ActivePositionsHeaderRow from './ActivePositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: auto;
  height: 300px;
  padding: 1rem 1.5rem;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
  ::-webkit-scrollbar {
    height: 8px;
  }
`

const StyledTableBorder = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ActivePositionsTable = ({ positionFarmsData }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledTable role="table" ref={tableWrapperEl}>
      {!(isMobile || isTablet) && <ActivePositionsHeaderRow />}
      {positionFarmsData.length ? (
        positionFarmsData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : (
        <Text textAlign="center">No Active Positions</Text>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
