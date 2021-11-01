import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, Flex, Box, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import LeverageRow from './LeverageRow'
import LeverageHeaderRow from './LeverageHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`





const LeverageTable = ({ leverageData, dexFilter, pairFilter, setDexFilter, setPairFilter }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <>
     
      <StyledTableBorder>
        <StyledTable role="table" ref={tableWrapperEl}>
          {!(isMobile || isTablet) && <LeverageHeaderRow />}
          {leverageData.map((token) => (
            <LeverageRow tokenData={token} key={token?.pid} />
          ))}
          <ScrollButtonContainer>
            <Button variant="text" onClick={scrollToTop}>
              To Top
              <ChevronUpIcon color="primary" />
            </Button>
          </ScrollButtonContainer>
        </StyledTable>
      </StyledTableBorder>
    </>
  )
}

export default LeverageTable
