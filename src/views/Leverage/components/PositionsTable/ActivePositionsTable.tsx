import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import ActivePositionsRow from './ActivePositionsRow'

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

const ActivePositionsTable = ({ data, farmsData  }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const positionFarmsData = [];

  if (data && data !== null && data !== undefined) {
    // eslint-disable-next-line array-callback-return
    data.map((pdata) => {
      let pfarmData;
      // eslint-disable-next-line array-callback-return
      farmsData.map((farm) => {
        if (farm.workerAddress[56].toUpperCase() === pdata.worker.toUpperCase()) {
          pfarmData = pdata;
          pfarmData.farmData = farm;
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>

        {positionFarmsData ? positionFarmsData.map((pd) => (
          <ActivePositionsRow data={pd} key={pd?.id} />
        )) : null}

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

export default ActivePositionsTable
