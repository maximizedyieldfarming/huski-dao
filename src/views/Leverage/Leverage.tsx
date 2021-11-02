/* eslint-disable array-callback-return */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import {
  useLeverageFarms,
  usePollLeverageFarmsWithUserData,
  useHuskyPrice,
  useHuskyPerBlock,
  useCakePrice,
} from 'state/leverage/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SearchInput from 'components/SearchInput'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useClaimFairLaunch } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useGetPositions } from 'hooks/api'
import { usePositions } from './hooks/usePositions'
import bone2 from './assets/bone2-1x.png'
import LeverageTable from './components/LeverageTable/LeverageTable'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'
import { getYieldFarming, getTvl } from './helpers'
import { ReactComponent as AllFilter } from './assets/AllFilter.svg'
import { ReactComponent as BnbIcon } from './assets/Bnb.svg'
import { ReactComponent as BusdIcon } from './assets/Busd.svg'
import { ReactComponent as BtcbIcon } from './assets/Btcb.svg'
import { ReactComponent as EthIcon } from './assets/Eth.svg'
import { ReactComponent as PancakeSwapIcon } from './assets/pancakeswap.svg'

const ImageContainer = styled.figure`
  display: none;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: block;
  }
`

const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const PositionsButton = styled(ActionButton)`
  background-color: unset;
  border-bottom: ${({ isActive }) => (isActive === 'true' ? '2px solid #9615e7' : 'unset')};
  color: ${({ isActive }) => (isActive === 'true' ? '#9615E7' : '#9D9D9D')};
  font-weight: bold;
  border-radius: unset;
  padding: unset;
  padding-bottom: 10px;
`

const RewardsContainer = styled(Flex)`
  flex-direction: row;
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  padding: 10px 2rem;
  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
  }
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

const FilterOption = styled(Button)`
  padding: 10px;
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : 'unset')};
  // color: ${({ theme, isActive }) => isActive && theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.default};
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
`

const FiltersWrapper = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 0.5rem;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > .dexFilter {
  }
  > .tokenFilter {
    overflow-x: auto;
  }
  .searchSortContainer {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      margin-left: auto;
      flex-direction: row;
      gap: 10px;
    }
  }
`

const Leverage: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  let { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  usePollLeverageFarmsWithUserData()
  const data = useGetPositions(account)
  const positionData = usePositions(data)

  const positionFarmsData = []
  if (positionData && positionData !== null && positionData !== undefined) {
    positionData.map((pdata) => {
      let pfarmData
      farmsData.map((farm) => {
        if (farm.workerAddress[56].toUpperCase() === pdata.worker.toUpperCase()) {
          pfarmData = pdata
          pfarmData.farmData = farm
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  // if (data && data !== null && data !== undefined) {
  //   data.map((pdata) => {
  //     let pfarmData
  //     farmsData.map((farm) => {
  //       if (farm.workerAddress[56].toUpperCase() === pdata.worker.toUpperCase()) {
  //         pfarmData = pdata
  //         pfarmData.farmData = farm
  //         positionFarmsData.push(pfarmData)
  //       }
  //     })
  //   })
  // }

  console.info('farmsData', farmsData)
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

  let reward = 0
  positionFarmsData.map((farm) => {
    const farmEarnings = new BigNumber(parseFloat(farm?.farmData?.userData?.farmEarnings))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    reward += farmEarnings
    return reward
  })

  return (
    <Page>
      <TopSection justifyContent="space-between">
        <RewardsContainer flexDirection="row" borderRadius="20px">
          <ImageContainer style={{ position: 'absolute', left: '-35px', top: '50%' }}>
            <img src={bone2} alt="" />
          </ImageContainer>
          <Box padding="0 1rem">
            <Text mb="1rem">HUSKI Rewards</Text>
            <Text>{reward.toPrecision(3)}</Text>
          </Box>
          <Flex alignSelf="flex-end">
            <Button
              as={Link}
              to={{ pathname: '/leverage/claim', state: { positionFarmsData, farmsData } }}
              disabled={!account}
            >
              {t('Claim')}
            </Button>
          </Flex>
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

      {isActivePos ? (
        <ActivePositionsTable positionFarmsData={positionFarmsData} />
      ) : (
        <LiquidatedPositionsTable data={null} />
      )}

      <Box>
        <FiltersWrapper>
          <Flex alignItems="center" className="dexFilter">
            <Text>DEX:</Text>
            <Flex overflowX="auto">
              <FilterOption
                variant="tertiary"
                startIcon={<AllFilter className="allFilter" />}
                isActive={dexFilter === 'all'}
                onClick={() => setDexFilter('all')}
              >
                All
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<PancakeSwapIcon />}
                isActive={dexFilter === 'pancake_swap'}
                onClick={() => setDexFilter('pancake_swap')}
              >
                PancakeSwap
              </FilterOption>
            </Flex>
          </Flex>
          <Flex alignItems="center" className="tokenFilter">
            <Text>Paired Assets:</Text>
            <Flex overflowX="auto">
              <FilterOption
                variant="tertiary"
                startIcon={<AllFilter className="allFilter" />}
                isActive={pairFilter === 'all'}
                onClick={() => setPairFilter('all')}
              >
                All
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BnbIcon />}
                isActive={pairFilter === 'wbnb'}
                onClick={() => setPairFilter('wbnb')}
              >
                BNB
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BusdIcon />}
                isActive={pairFilter === 'busd'}
                onClick={() => setPairFilter('busd')}
              >
                BUSD
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<BtcbIcon />}
                isActive={pairFilter === 'btcb'}
                onClick={() => setPairFilter('btcb')}
              >
                BTCB
              </FilterOption>
              <FilterOption
                variant="tertiary"
                startIcon={<EthIcon />}
                isActive={pairFilter === 'eth'}
                onClick={() => setPairFilter('eth')}
              >
                ETH
              </FilterOption>
            </Flex>
          </Flex>
          <Flex className="searchSortContainer">
            <SearchInput onChange={handleChangeQuery} placeholder="Search" />
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
        </FiltersWrapper>

        <LeverageTable
          leverageData={farmsData}
          dexFilter={dexFilter}
          pairFilter={pairFilter}
          setDexFilter={setDexFilter}
          setPairFilter={setPairFilter}
        />
      </Box>
    </Page>
  )
}

export default Leverage
