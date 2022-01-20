import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { Button, Flex, Box, Text, useMatchBreakpoints, ChevronUpIcon } from '@huskifinance/huski-frontend-uikit'
import SearchInput from 'components/SearchInput'
import Select from 'components/Select/SelectSort'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import { BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiIcon } from 'assets'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
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

const FilterOption = styled(Button)`
  padding: 5px;
  font-size: 13px;
  background-color: ${({ isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
  color: ${({ isActive, theme }) => (isActive ? 'white' : theme.isDark ? '#6F767E' : '#9D9D9D')};
  border-radius: 10px;
  margin: 0 5px;
  > svg {
    height: 28px;
    width: 28px;
    path {
      height: auto;
      width: 100%;
    }
    &.allFilter {
      fill: #f7931a;
    }
  }
  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    transform: none;
  }
`

const FiltersWrapper = styled(Flex)`
  flex-wrap: wrap;
  flex-direction: column;
  // hide scrollbar
  *::-webkit-scrollbar {
    display: none;
  }
  * {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  > ${Flex} {
    margin-bottom: 10px;
    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > .dexFilter {
    > ${Flex} {
      overflow: auto;
    }
  }
  > .tokenFilter {
    > ${Flex} {
      overflow: auto;
    }
  }
  .searchSortContainer {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      align-items: center;
      margin-left: auto;
      flex-direction: row;
      gap: 10px;
    }
  }
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



      {/* <Container id="farms-table">
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {rows.map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container> */}




    </>
  )
}

export default LeverageTable
