import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
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

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LockTable = ({ data }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  /*  const mockData = [
    {
      id: '1',
      name: 'Test',
      apy: '0.01',
      totalsHuskiLocked: '0.01',
      totalValueLocked: '0.01',
      unlockDate: '03/04/2021',
      sHuskiLocked: '0.01',
      rewards: '0.01',
    },
    {
      id: '2',
      name: 'Test2',
      apy: '0.02',
      totalsHuskiLocked: '0.02',
      totalValueLocked: '0.02',
      unlockDate: '06/04/2021',
      sHuskiLocked: '0.02',
      rewards: '0.02',
    },
  ]
 */
  const { isMobile, isTablet } = useMatchBreakpoints()
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {data?.map((token) => (
          <LockRow lockData={token} key={token.id} />
        ))}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LockTable
