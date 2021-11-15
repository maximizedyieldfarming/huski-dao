/* eslint-disable array-callback-return */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import styled from 'styled-components'
import { Box, Button, Flex, Text, Grid } from '@pancakeswap/uikit'
import { AllFilterIcon, BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon } from 'assets'
import { useTranslation } from 'contexts/Localization'
import { useGetPositions } from 'hooks/api'
import { usePositions } from './hooks/usePositions'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'
import SingleAssetsCard from './components/SingleAssetsCards'

const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const PositionsButton = styled(ActionButton)`
  background-color: unset;
  border-bottom: ${({ isActive, theme }) => (isActive === 'true' ? `2px solid ${theme.colors.secondary}` : 'unset')};
  color: ${({ isActive, theme }) => (isActive === 'true' ? theme.colors.secondary : theme.colors.textSubtle)};
  font-weight: bold;
  border-radius: unset;
  padding: unset;
  padding-bottom: 10px;
  &:first-child {
    margin-right: 1rem;
  }
`

const RewardsContainer = styled(Box)`
  flex-direction: row;
  position: relative;
  align-self: flex-end;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const PositionButtonsContainer = styled(Box)`
  > div {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  padding: 1px 1px 1px 1px;
  background-size: 400% 400%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  overflow: hidden;
  padding: 1rem 1.5rem;
`

const CardsWrapper = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(300px, 360px));
  justify-content: space-between;
`

const FilterOption = styled(Button)`
  padding: 5px;
  background-color: transparent;
  border-bottom: ${({ theme, isActive }) => (isActive ? `1px solid ${theme.colors.secondary}` : 'unset')};
  color: ${({ theme }) => theme.colors.text};
  border-radius: unset;
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
  &:active:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled) {
    transform: none;
  }
`

const FiltersWrapper = styled(Flex)`
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  // margin-bottom: 0.5rem;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > ${Flex} {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    padding: 10px 1rem;
    border-radius: ${({ theme }) => theme.radii.card};
    box-shadow: ${({ theme }) => theme.card.boxShadow};
  }
  .dexFilter {
  }
  .tokenFilter {
    > ${Flex} {
      overflow: auto;
      ::-webkit-scrollbar {
        height: 8px;
      }
    }
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
const StrategyIcon = styled.div<{ market: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: ${({ theme, market }) => {
    if (market.toLowerCase() === 'bear') {
      return '#FE6057'
    }
    if (market.toLowerCase() === 'bull') {
      return '#27C73F'
    }
    if (market.toLowerCase() === 'neutral') {
      return '#FCBD2C'
    }
    return null
  }};
`

const SingleAssetsFarms: React.FC = () => {
  const { t } = useTranslation()
  const match = useRouteMatch()
  const { account } = useWeb3React()
  const { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  usePollLeverageFarmsWithUserData()

  const singleData = farmsData.filter((f) => f.singleFlag === 0)

  const bnbArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'wBNB')
  const btcbArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'BTCB')
  const ethArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'ETH')
  const huskiArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'ALPACA') // HUSKI
  const cakeArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'CAKE')

  const marketArray = [
    {
      singleLeverage: 2,
      direction: 'long',
      marketStrategy: 'Bull',
    },
    {
      singleLeverage: 2,
      direction: 'short',
      marketStrategy: 'Neutral',
    },
    {
      singleLeverage: 3,
      direction: 'short',
      marketStrategy: 'Bear',
    },
  ]
  // let singleNewData = []

  // if (bnbArray && bnbArray !== null && bnbArray !== undefined) {
  //   let single
  //   bnbArray.map((item) => {
  //     marketArray.map((market) => {
  //       single = { ...market, ...item }
  //       singleNewData.push(single)
  //     })
  //   })
  // }

  let singlesData = []

  if (bnbArray && bnbArray !== null && bnbArray !== undefined && bnbArray !== [] && bnbArray.length !== 0) {
    let single
    const farmData = bnbArray
    marketArray.map((item) => {
      const newObject = { farmData }
      single = { ...newObject, ...item }
      singlesData.push(single)
    })
  }
  if (btcbArray && btcbArray !== null && btcbArray !== undefined && btcbArray !== [] && btcbArray.length !== 0) {
    let single
    const farmData = btcbArray
    marketArray.map((item) => {
      const newObject = { farmData }
      single = { ...newObject, ...item }
      singlesData.push(single)
    })
  }
  if (ethArray && ethArray !== null && ethArray !== undefined && ethArray !== [] && ethArray.length !== 0) {
    let single
    const farmData = ethArray
    marketArray.map((item) => {
      const newObject = { farmData }
      single = { ...newObject, ...item }
      singlesData.push(single)
    })
  }
  if (huskiArray && huskiArray !== null && huskiArray !== undefined && huskiArray !== [] && huskiArray.length !== 0) {
    let single
    const farmData = huskiArray
    marketArray.map((item) => {
      const newObject = { farmData }
      single = { ...newObject, ...item }
      singlesData.push(single)
    })
  }
  if (cakeArray && cakeArray !== null && cakeArray !== undefined && cakeArray !== [] && cakeArray.length !== 0) {
    let single
    const farmData = cakeArray
    marketArray.map((item) => {
      const newObject = { farmData }
      single = { ...newObject, ...item }
      singlesData.push(single)
    })
  }


usePollLeverageFarmsWithUserData()
  const data = useGetPositions(account)
  const positionData = usePositions(data)
  const positionFarmsData = []
  if (positionData && positionData !== null && positionData !== undefined && positionData !== [] && positionData.length !== 0) {
    positionData.map((pdata) => {
      let pfarmData
      farmsData.map((farm) => {
        if (
          farm.TokenInfo.address.toUpperCase() === pdata.worker.toUpperCase() ||
          farm.QuoteTokenInfo.address.toUpperCase() === pdata.worker.toUpperCase()
        ) {
          pfarmData = pdata
          pfarmData.farmData = farm
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  const reward = null

  const [dexFilter, setDexFilter] = useState('all')
  const [pairFilter, setPairFilter] = useState('all')
  const [strategyFilter, setStrategyFilter] = useState('all')

  // filters
  if (pairFilter !== 'all') {
    singlesData = singlesData.filter(
      (pool) => pool.farmData[0]?.TokenInfo?.quoteToken?.symbol.toLowerCase() === pairFilter,
      //       pool?.TokenInfo?.token?.symbol.toLowerCase() === pairFilter,
    )
  }
  /* if (strategyFilter !== 'all') {
    singleNewData = singleNewData.filter(
      (pool) => pool.data?.TokenInfo?.token?.symbol.toLowerCase() === strategyFilter,
    )
  }
 */

  return (
    <Page>
      <RewardsContainer>
        <Text mb="8px">{t('HUSKI Rewards')}</Text>
        <Flex justifyContent="space-between" alignItems="flex-end" style={{ gap: '4rem' }}>
          <Text color="secondary" bold fontSize="2">
            {reward?.toPrecision(3)}
          </Text>
          <Button as={Link} to={{ pathname: '/leverage/claim' }} disabled={!account} scale="sm">
            {t('Claim')}
          </Button>
        </Flex>
      </RewardsContainer>

      <StyledTableBorder>
        <PositionButtonsContainer>
          <Box>
            <PositionsButton isActive={isActivePos ? 'true' : 'false'} onClick={() => setActive(true)}>
              {t('Active Positions')}
            </PositionsButton>
            <PositionsButton isActive={isActivePos ? 'false' : 'true'} onClick={() => setActive(false)}>
              {t('Liquidated Positions')}
            </PositionsButton>
          </Box>
        </PositionButtonsContainer>
        {isActivePos ? <ActivePositionsTable positionFarmsData={positionFarmsData} /> : <LiquidatedPositionsTable data={null} />}
      </StyledTableBorder>

      <FiltersWrapper>
        <Flex alignItems="center" className="dexFilter">
          <Text>DEX:</Text>
          <Flex overflowX="auto">
            <FilterOption
              variant="tertiary"
              startIcon={<AllFilterIcon className="allFilter" />}
              isActive={dexFilter === 'all'}
              onClick={() => setDexFilter('all')}
            >
              {t('All')}
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
        <Flex alignItems="center" className="strategyFilter">
          <Text>{t('Strategy:')}</Text>
          <Flex>
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'bull'}
              onClick={() => setStrategyFilter('bull')}
              startIcon={<StrategyIcon market="bull" />}
            >
              Bull Market
            </FilterOption>
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'bear'}
              onClick={() => setStrategyFilter('bear')}
              startIcon={<StrategyIcon market="bear" />}
            >
              Bear Market
            </FilterOption>
            <FilterOption
              variant="tertiary"
              isActive={strategyFilter === 'neutral'}
              onClick={() => setStrategyFilter('neutral')}
              startIcon={<StrategyIcon market="neutral" />}
            >
              Market Neutral
            </FilterOption>
          </Flex>
        </Flex>
        <Flex alignItems="center" className="tokenFilter">
          <Text>{t('Paired Assets:')}</Text>
          <Flex>
            <FilterOption
              variant="tertiary"
              startIcon={<AllFilterIcon className="allFilter" />}
              isActive={pairFilter === 'all'}
              onClick={() => setPairFilter('all')}
            >
              {t('All')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              startIcon={<BnbIcon />}
              isActive={pairFilter === 'huski'}
              onClick={() => setPairFilter('huski')}
            >
              HUSKI
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
      </FiltersWrapper>
      <CardsWrapper>
        {/* change data to mockSingleAssetData to see the cards appear for testing */}
        {singlesData?.map((asset) => (
          <SingleAssetsCard
            data={asset}
            // key={asset.pid}
          />
        ))}
      </CardsWrapper>
    </Page>
  )
}

export default SingleAssetsFarms
