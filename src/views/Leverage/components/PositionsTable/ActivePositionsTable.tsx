import React, { useRef } from 'react'
import styled from 'styled-components'
import { Text, useMatchBreakpoints, Box } from 'husky-uikit'
import { useTranslation } from 'contexts/Localization'
import ActivePositionsRow from './ActivePositionsRow'
import ActivePositionsHeaderRow from './ActivePositionsHeaderRow'

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  overflow: auto;
  height: 300px;
  ${({ theme }) => theme.mediaQueries.lg} {
    height: unset;
  }
  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.disabled};
  }
  ::-webkit-scrollbar {
    height: 8px;
  }
`

const ActivePositionsTable = ({ positionFarmsData }) => {
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
      {!(isMobile || isTablet) && positionFarmsData?.length ? <ActivePositionsHeaderRow /> : null}
      {positionFarmsData?.length ? (
        positionFarmsData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : (
        <Box padding="100px">
          <Text textAlign="center">{t('No Active Positions')}</Text>
        </Box>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
