import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Box } from 'husky-uikit1.0'
import LendRow from './LendRow'
import LendHeaderRow from './LendHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.card.background};
  background-repeat: no-repeat;

  background-position: right; 
  background-size:350px 400px;
  // > div:not(:last-child) {
  //   border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  // }
  > div:first-child {
    border-bottom:1px solid #EFEFEF!important;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1px 1px 1px 1px;
  background-size: 400% 400%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const LendTable = ({ lendData }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { isMobile, isTablet } = useMatchBreakpoints()
  const [isShown, setIsShown] = useState(-1);

  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {!(isMobile || isTablet) && <LendHeaderRow />}
        {lendData.map((token, index) => (
          <LendRow tokenData={token} key={token?.pid} index={index} isShown={isShown} setIsShown={setIsShown} />
        ))}
        {/*   <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            To Top
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer> */}
      </StyledTable>
    </StyledTableBorder>
  )
}

export default LendTable
