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
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Select from 'components/Select/Select'
import { Box, Button, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { useTradeFee } from 'hooks/api'
import { latinise } from 'utils/latinise'
import { orderBy } from 'lodash'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import husky2 from './assets/husky2@1x.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'
import LeverageTable from './components/LeverageTable/LeverageTable'
import TopTable from './components/TopTable/TopTable'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'
import LeverageCard from './components/LeverageCard/LeverageCard'
import { getHuskyRewards, getYieldFarming, getTvl, getTradingFees } from './helpers'

const TableWrapper = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  > div:first-child {
    flex-grow: 1;
  }
  > figure {
    display: none;
    ${({ theme }) => theme.mediaQueries.xxl} {
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
  const data = useTradeFee()
  usePollLeverageFarmsWithUserData()

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
    farmsData = farmsData.filter((token) => token.token.symbol.toLowerCase().includes(lowercaseQuery))
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
          (token) =>
            token.totalToken ? parseFloat(getDisplayApr(getYieldFarming(token, cakePrice) * token?.leverage)) : 0,
          'desc',
        )
      case 'tvl':
        return orderBy(dataToSort, (token) => (token.totalToken ? getTvl(token).totalTvl.toNumber() : 0), 'desc')

      case 'leverage':
        return orderBy(dataToSort, (token) => (token.leverage ? token.leverage : 0), 'desc')

      default:
        return dataToSort
    }
  }

  farmsData = sortPools(farmsData)

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
              <Skeleton width="80px" height="16px" />

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

      <TableWrapper>
        <TopTable data={farmsData} isActivePos={isActivePos} />
        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </TableWrapper>

      <Flex alignSelf="flex-end">
        <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
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
      {viewMode === ViewMode.CARD ? cardLayout : <LeverageTable leverageData={farmsData} />}
    </Page>
  )
}

export default Leverage
