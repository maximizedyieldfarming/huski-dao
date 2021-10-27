import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, Text, useMatchBreakpoints, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import LiquidatedPositionsRow from './LiquidatedPositionsRow'
import LiquidatedPositionsHeaderRow from './LiquidatedPositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: auto;
  height: 300px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const LiquidatedPositionsTable = ({ data }) => {
  console.log('liquidated pos', data)
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
        {!(isMobile || isTablet) && <LiquidatedPositionsHeaderRow />}
        {data ? (
          <LiquidatedPositionsRow data={data} />
        ) : (
          <Box padding="100px 0">
            <Text textAlign="center">No Liquidated Positions</Text>
          </Box>
        )}

        {/*  <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            To Top
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer> */}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LiquidatedPositionsTable
