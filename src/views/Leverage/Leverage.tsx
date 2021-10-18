import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import usePersistState from 'hooks/usePersistState'
import {
  useLeverageFarms,
  usePollLeverageFarmsWithUserData,
  useHuskyPrice,
  useHuskyPerBlock,
  useCakePrice,
} from 'state/leverage/hooks'
import SearchInput from 'components/SearchInput'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Select from 'components/Select/Select'
import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useGetPositions } from 'hooks/api'
import husky2 from './assets/husky2@1x.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'
import LeverageTable from './components/LeverageTable/LeverageTable'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'
import LeverageCard from './components/LeverageCard/LeverageCard'
import { getHuskyRewards, getYieldFarming, getTvl } from './helpers'

const PositionsTableWrapper = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;

  > div:first-child {
    flex-grow: 1;
  }
  > figure {
    display: none;
    ${({ theme }) => theme.mediaQueries.xxl} {
      margin-left: 10px;
      display: block;
    }
  }
`
const ImageContainer = styled.figure`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const StyledBox = styled(Box)`
  color: #9615e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 10px;
  gap: 1rem;
  span:last-child {
    font-size: 2rem;
  }
`

const Title = styled.div`
  color: #9615e7;
  font-size: 36px;
`

const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const PositionsButton = styled(ActionButton)`
  background-color: ${(props) => (props.isActive === 'true' ? '#9615E7' : ({ theme }) => theme.card.background)};
  border: 1px solid #9615e7;
  color: ${(props) => (props.isActive === 'true' ? '#fff' : '#9615E7')};
  // font-size: 20px;
  font-weight: bold;
  border-radius: 21px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`

const RewardsContainer = styled(Flex)`
  flex-direction: row;
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  padding: 5px 2rem;
  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
  }
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const TopSection = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const PositionButtonsContainer = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const Leverage: React.FC = () => {
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  let { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  usePollLeverageFarmsWithUserData()
console.info('farmsData',farmsData);
  const data =  useGetPositions()

  const cardLayout = (
    <CardLayout>
      {farmsData.map((token) => (
        <LeverageCard tokenData={token} key={token?.pid} />
      ))}
    </CardLayout>
  )

  // search feature
  const [searchQuery, setSearchQuery] = useState('')
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    farmsData = farmsData.filter((pool) => pool.lpSymbol.toLowerCase().includes(lowercaseQuery))
  }

  // sort feature
  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()
  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }
  // const yieldFarmData = getYieldFarming(tokenData, cakePrice)

  const [sortOption, setSortOption] = useState('default')
  const handleSortOptionChange = (option) => {
    setSortOption(option.value)
  }
  const sortPools = (dataToSort) => {
    switch (sortOption) {
      case 'apy':
        return orderBy(
          dataToSort,
          (pool) =>
            pool.totalToken ? parseFloat(getDisplayApr(getYieldFarming(pool, cakePrice) * pool?.leverage)) : 0,
          'desc',
        )
      case 'tvl':
        return orderBy(dataToSort, (pool) => (pool.totalToken ? getTvl(pool).totalTvl.toNumber() : 0), 'desc')

      case 'leverage':
        return orderBy(dataToSort, (pool) => (pool.leverage ? pool.leverage : 0), 'desc')

      default:
        return dataToSort
    }
  }

  farmsData = sortPools(farmsData)

  const [dexFilter, setDexFilter] = useState('all')
  const [pairFilter, setPairFilter] = useState('all')

  if (pairFilter !== 'all') {
    farmsData = farmsData.filter(
      (pool) =>
        pool?.quoteToken?.symbol.toLowerCase() === pairFilter || pool?.token?.symbol.toLowerCase() === pairFilter,
    )
  }

  // this is part of the above condition
  // DO NOT DELETE, might be useful for when theres more data
  // commented out because of linter error
  // This condition will always return 'false' since the types '"all"' and '"others"' have no overlap.  TS2367
  /* else if (pairFilter === 'others') {
    farmsData = farmsData.filter(
      (pool) =>
        pool?.quoteToken?.symbol.toLowerCase() !== ('eth' || 'wbnb' || 'busd' || 'btcb') ||
        pool?.token?.symbol.toLowerCase() !== ('eth' || 'wbnb' || 'busd' || 'btcb'),
    )
  } */

  const positionFarmsData = []
  if (data && data !== null && data !== undefined) {
    // eslint-disable-next-line array-callback-return
    data.map((pdata) => {
      let pfarmData
      // eslint-disable-next-line array-callback-return
      farmsData.map((farm) => {
        if (farm.workerAddress[56].toUpperCase() === pdata.worker.toUpperCase()) {
          pfarmData = pdata
          pfarmData.farmData = farm
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  console.info('positionFarmsData',positionFarmsData)

  let reward = 0;
  positionFarmsData.map((farm) => {
    const farmEarnings = new BigNumber(parseFloat(farm?.farmData?.userData?.farmEarnings)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += farmEarnings
    return reward
  })


  
  return (
    <Page>
      <TopSection justifyContent="space-between">
        <RewardsContainer flexDirection="row" borderRadius="20px">
          <ImageContainer style={{ position: 'absolute', left: '-35px' }}>
            <img src={bone2} alt="" />
          </ImageContainer>
          <StyledBox>
            <span>Husky Token Rewards</span>
            <Flex alignItems="center" style={{ gap: '10px' }}>
              {reward ? (
                <Text>
                  {reward.toPrecision(3)}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
              <ActionButton>Claim</ActionButton>
            </Flex>
          </StyledBox>
          <ImageContainer style={{ position: 'absolute', right: '-35px' }}>
            <img src={bone1} alt="" />
          </ImageContainer>
        </RewardsContainer>
        <PositionButtonsContainer alignSelf="flex-end" style={{ gap: '1rem' }}>
          <PositionsButton isActive={isActivePos ? 'true' : 'false'} onClick={() => setActive(true)}>
            Active Positions
          </PositionsButton>
          <PositionsButton isActive={isActivePos ? 'false' : 'true'} onClick={() => setActive(false)}>
            Liquidated Positions
          </PositionsButton>
        </PositionButtonsContainer>
      </TopSection>

      <PositionsTableWrapper>
        {isActivePos ? <ActivePositionsTable positionFarmsData={positionFarmsData} /> : <LiquidatedPositionsTable data={farmsData} />}
        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </PositionsTableWrapper>

      <Flex alignSelf="flex-end">
        <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
        <Flex alignItems="center" mr="10px">
          <SearchInput onChange={handleChangeQuery} placeholder="Search" />
        </Flex>
        <Select
          options={[
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'APY',
              value: 'apy',
            },
            {
              label: 'TVL',
              value: 'tvl',
            },
            {
              label: 'Leverage',
              value: 'leverage',
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </Flex>
      {viewMode === ViewMode.CARD ? (
        cardLayout
      ) : (
        <LeverageTable
          leverageData={farmsData}
          dexFilter={dexFilter}
          pairFilter={pairFilter}
          setDexFilter={setDexFilter}
          setPairFilter={setPairFilter}
        />
      )}
    </Page>
  )
}

export default Leverage
