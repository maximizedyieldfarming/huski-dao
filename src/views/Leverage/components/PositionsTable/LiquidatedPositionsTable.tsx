import React, { useRef } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Box } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import LiquidatedPositionsRow from './LiquidatedPositionsRow'
import LiquidatedPositionsHeaderRow from './LiquidatedPositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: hidden;
  height: 300px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    // border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
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

const LiquidatedPositionsTable = ({ data }) => {
  console.log('liquidated pos', data)
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <StyledTable role="table" ref={tableWrapperEl}>
      {!(isMobile || isTablet) && data && <LiquidatedPositionsHeaderRow />}
      {data ? (
        <LiquidatedPositionsRow data={data} />
      ) : (
        <Box padding="100px">
          <Text textAlign="center">{t('No Liquidated Positions')}</Text>
        </Box>
      )}
    </StyledTable>
  )
}

export default LiquidatedPositionsTable
