/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Text,
  Button,
  ArrowForwardIcon,
  Flex,
  Box,
  Skeleton,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { ChainId, Currency } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { useLendTotalSupply } from 'state/lend/hooks'
import {
  useLeverageFarms,
  usePollLeverageFarmsWithUserData
} from 'state/leverage/hooks'
import usePersistState from 'hooks/usePersistState'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { orderBy } from 'lodash'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import bone2 from './assets/bone2-1x.png'
import LendTable from './components/LendTable/LendTable'
import { getAprData } from './helpers'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const StyledBox = styled(Flex)`
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  // flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 10px 30px;
  span:last-child {
    font-size: 2rem;
  }
  > .imgContainer {
    position: absolute;
    // left: -40px;
    transform: translate(-100%, 0);
  }
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`
const TopSection = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-end;
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
  }
`

const Lend: React.FC = () => {
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const lendTotalSupply = useLendTotalSupply()
  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.token.poolId] ? '' : (hash[next.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })

  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <Page>
      <TopSection>
        <StyledBox>
          {!(isMobile || isTablet) && (
            <Box className="imgContainer">
              <img src={bone2} alt="" />
            </Box>
          )}
          <Box>
            <Text>Volume 24H:</Text>
            {/* lendTotalSupply ? <Text fontSize="30px">${lendTotalSupply}</Text> : <Skeleton width="180px" height="30px" /> */}
            <Skeleton width="180px" height="30px" />
          </Box>
        </StyledBox>
        <StyledBox>
          <Box>
            <Text>Total Value Locked:</Text>
            {lendTotalSupply ? (
              <Text fontSize="30px">{`$${lendTotalSupply}`}</Text>
            ) : (
              <Skeleton width="180px" height="30px" />
            )}
          </Box>
        </StyledBox>
      </TopSection>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
