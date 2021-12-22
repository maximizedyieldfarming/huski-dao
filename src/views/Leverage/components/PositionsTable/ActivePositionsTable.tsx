import React, { useRef } from 'react'
import styled from 'styled-components'
import { useMatchBreakpoints, Grid, Skeleton, Flex, Box, Text } from 'husky-uikit1.0'
import { useTranslation } from 'contexts/Localization'
import { useLocation } from 'react-router-dom'
import ActivePositionsRow from './ActivePositionsRow'
import ActivePositionsHeaderRow from './ActivePositionsHeaderRow'

const StyledTable = styled.div`
  // border-radius: ${({ theme }) => theme.radii.card};
  overflow: auto;
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

const ActivePositionsTable = ({ positionFarmsData }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  const { pathname } = useLocation()

  const [isLoading, setIsLoading] = React.useState(true)
  React.useEffect(() => {
    setTimeout(() => {
      if (positionFarmsData.length === 0) {
        setIsLoading(false)
      }
    }, 8000)
  })

  const loader = (() => {
    if (isSmallScreen) {
      return (
        <>
          {[...Array(4)].map((_, i) => (
            <Flex justifyContent="space-between" alignItems="center" padding="1rem 0">
              <Skeleton key={_} width={i % 2 === 0 ? '200px' : '90px'} height="2rem" />
              <Skeleton key={_} width={i % 2 === 0 ? '90px' : '200px'} height="2rem" />
            </Flex>
          ))}
          <Skeleton width="100%" height="2rem" />
        </>
      )
    }
    return (
      <>
        <Grid
          gridTemplateColumns={pathname === 'farms' ? 'repeat(10, 1fr)' : 'repeat(8, 1fr)'}
          justifyContent="space-between"
          padding="1rem 0"
        >
          {[...Array(pathname === 'farms' ? 10 : 8)].map((_, i) => (
            <Skeleton key={_} width="80px" height="1rem" />
          ))}
        </Grid>
        <Skeleton width="100%" height="3rem" marginBottom="1rem" />
        <Skeleton width="100%" height="3rem" />
      </>
    )
  })()

  return (
    <StyledTable role="table">
      {!(isMobile || isTablet) && positionFarmsData?.length ? <ActivePositionsHeaderRow /> : null}
      {positionFarmsData?.length ? (
        positionFarmsData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : isLoading ? (
        loader
      ) : (
        <Box padding="100px">
          <Text textAlign="center">{t('No Active Positions')}</Text>
        </Box>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
