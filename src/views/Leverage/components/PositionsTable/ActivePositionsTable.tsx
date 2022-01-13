import React, { useRef } from 'react'
import styled, {css} from 'styled-components'
import { useMatchBreakpoints, Grid, Skeleton, Flex, Text } from '@huskifinance/huski-frontend-uikit'
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

  const Loader = () => {
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
        <Flex
          justifyContent="space-between"
          padding="1rem 0"
        >
          {[...Array(pathname === 'farms' ? 10 : 8)].map((_, i) => (
            <Skeleton key={_} width="80px" />
          ))}
        </Flex>
        <Skeleton width="100%" height="3rem" marginBottom="1rem" />
        <Skeleton width="100%" height="3rem" />
      </>
    )
  }

  return (
    <StyledTable role="table">
      {!(isMobile || isTablet) && positionFarmsData?.length ? <ActivePositionsHeaderRow /> : null}
      {positionFarmsData?.length ? (
        positionFarmsData.map((pd) => <ActivePositionsRow data={pd} key={pd?.positionId} />)
      ) : isLoading ? (
        <Loader />
      ) : (
        <Flex height="calc(9rem + 20px)" alignItems="center" justifyContent="center">
          <Text textAlign="center" fontSize="18px" fontWeight="500" lineHeight="48px" color="inputSecondary">{t('No Active Positions')}</Text>
        </Flex>
      )}
    </StyledTable>
  )
}

export default ActivePositionsTable
