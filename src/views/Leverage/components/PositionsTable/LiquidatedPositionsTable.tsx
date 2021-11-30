import React, { useRef } from 'react'
import styled from 'styled-components'
<<<<<<< HEAD
import { Text, useMatchBreakpoints, Box } from 'husky-uikit1.0'
=======
import { Text, useMatchBreakpoints, Box } from 'husky-uikit'
>>>>>>> v1/master
import { useTranslation } from 'contexts/Localization'
import LiquidatedPositionsRow from './LiquidatedPositionsRow'
import LiquidatedPositionsHeaderRow from './LiquidatedPositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
<<<<<<< HEAD
  overflow: hidden;
=======
  overflow: auto;
>>>>>>> v1/master
  height: 300px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
<<<<<<< HEAD
    // border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
=======
    border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
>>>>>>> v1/master
  }
  ::-webkit-scrollbar {
    height: 8px;
  }
`

<<<<<<< HEAD
const StyledTableBorder = styled.div`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

=======
>>>>>>> v1/master
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
<<<<<<< HEAD
      {!(isMobile || isTablet) && <LiquidatedPositionsHeaderRow />}
      {/* this is commented for testing //////////////////////////////////////////////////////     */}
      {/* {data ? (
        <LiquidatedPositionsRow data={data} />
      ) : (
        <Box padding="100px 0">
          <Text textAlign="center">{t('No Liquidated Positions')}</Text>
        </Box>
      )} */}
      
        <LiquidatedPositionsRow data={null} />
      

=======
      {!(isMobile || isTablet) && data && <LiquidatedPositionsHeaderRow />}
      {data ? (
        <LiquidatedPositionsRow data={data} />
      ) : (
        <Box padding="100px">
          <Text textAlign="center">{t('No Liquidated Positions')}</Text>
        </Box>
      )}
>>>>>>> v1/master
    </StyledTable>
  )
}

export default LiquidatedPositionsTable
