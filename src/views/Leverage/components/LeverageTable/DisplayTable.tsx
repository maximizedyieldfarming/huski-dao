import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Button, Box, useMatchBreakpoints, ChevronUpIcon } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import LeverageRow from './LeverageRow'
import LeverageHeaderRow from './LeverageHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 24px 24px;
  background-color: ${({ theme }) => theme.card.background};
  > ${Box} {
    overflow: auto;
    ::-webkit-scrollbar {
      height: 8px;
    }
  }
`

const StyledTableBorder = styled.div`
border-collapse: collapse;
font-size: 14px;
border-radius: 4px;
margin-left: auto;
margin-right: auto;
width: 100%;
`

const TableContainer = styled.div`
  position: relative;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LeverageTable = ({ leverageData }) => {
  const farmsData = leverageData
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <>
      <StyledTableBorder>
        <TableContainer>
          <TableWrapper ref={tableWrapperEl}>
            <StyledTable>
              {!(isMobile || isTablet) && <LeverageHeaderRow />}
              {farmsData.map((token) => (
                <LeverageRow tokenData={token} key={token?.pid} />
              ))}
            </StyledTable>
          </TableWrapper>
          <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              {t('To Top')}
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer>
        </TableContainer>
      </StyledTableBorder>
    </>
  )
}

export default LeverageTable
