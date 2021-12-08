/* eslint-disable array-callback-return */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link, Route, useRouteMatch, Switch } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { Box, Button, Flex, Text, Grid } from 'husky-uikit1.0'
import { AllFilterIcon, BnbIcon, BtcbIcon, BusdIcon, EthIcon, PancakeSwapIcon, HuskiIcon } from 'assets'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useClaimFairLaunch } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useGetPositions } from 'hooks/api'
import { usePositions } from './hooks/usePositions'
import LeverageTable from './components/LeverageTable/LeverageTable'
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 500px));
  justify-content: space-between;
`

const FilterOption = styled(Button)`
padding: 10px;
font-size:13px;
background-color: ${({ theme, isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
// border-bottom: ${({ theme, isActive }) => (isActive ? `1px solid ${theme.colors.secondary}` : 'unset')};
color: ${({ theme, isActive }) => (isActive ? '#FFFFFF!important' : "#9D9D9D!important")};
border-radius: 10px;
color:#9D9D9D;
> img {
  height: 26px;
  width: 26px;
  margin-right:10px;
}
> svg {
  height: 26px;
  width: 26px;
  margin-right:10px;
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
  gap: 1rem;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  padding-top : 10px;
  padding-bottom : 10px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  // margin-bottom: 0.5rem;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > ${Flex} {
    
    padding-left: 1rem;
    padding-right : 1rem;
    font-size : 13px;
  }
  > ${Flex} > ${Flex}{
    ::-webkit-scrollbar {
      height: 8px;
    }
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
const SBBox = styled(Box)`
  border-radius:15px!important;
  background-image: url('/images/BG.png');
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
`

const Section = styled(Flex)`
  background-color: 'transparent';
  padding: 0.5rem;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.default};
  height:224px;
  .container {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.small};
  }
`
const StyledButton = styled(Button)`
  background: #FFFFFF;
  border: 1px solid #EFEFEF;
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 32px;
  text-align:center;
  display:flex;
  justify-content:center;
  flex-direction:column;
`

const SingleAssetsFarms: React.FC = () => {
  const { t } = useTranslation()
  const match = useRouteMatch()
  const { account } = useWeb3React()
  const { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  const { isDark } = useTheme()
  usePollLeverageFarmsWithUserData()

  let singleData = farmsData.filter((f) => f.singleFlag === 0);
  console.log(singleData);


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

  const singlesData = []

  if (bnbArray && bnbArray !== null && bnbArray !== undefined && bnbArray !== [] && bnbArray.length !== 0) {

    const tokenObject = {
      name: 'BNB',
      singleArray: bnbArray
    }
    singlesData.push(tokenObject)

    // let single
    // const farmData = bnbArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
  }
  if (btcbArray && btcbArray !== null && btcbArray !== undefined && btcbArray !== [] && btcbArray.length !== 0) {

    const tokenObject = {
      name: 'BTCB',
      singleArray: btcbArray
    }
    singlesData.push(tokenObject)
    // let single
    // const farmData = btcbArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
  }
  if (ethArray && ethArray !== null && ethArray !== undefined && ethArray !== [] && ethArray.length !== 0) {
    // let single
    // const farmData = ethArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
    const tokenObject = {
      name: 'ETH',
      singleArray: ethArray
    }
    singlesData.push(tokenObject)
  }
  if (huskiArray && huskiArray !== null && huskiArray !== undefined && huskiArray !== [] && huskiArray.length !== 0) {
    const tokenObject = {
      name: 'ALPACA',
      singleArray: huskiArray
    }
    singlesData.push(tokenObject)

    // let single
    // const farmData = huskiArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
  }
  if (cakeArray && cakeArray !== null && cakeArray !== undefined && cakeArray !== [] && cakeArray.length !== 0) {
    // let single
    // const farmData = cakeArray
    // marketArray.map((item) => {
    //   const newObject = { farmData }
    //   single = { ...newObject, ...item }
    //   singlesData.push(single)
    // })
    const tokenObject = {
      name: 'CAKE',
      singleArray: cakeArray
    }
    singlesData.push(tokenObject)
  }

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

  let reward = 0;

  positionFarmsData.map((farm) => {
    const farmEarnings = new BigNumber(parseFloat(farm?.farmData?.userData?.farmEarnings))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    reward += farmEarnings
    return reward
  })

  const [dexFilter, setDexFilter] = useState('all')
  const [pairFilter, setPairFilter] = useState('all')
  const [strategyFilter, setStrategyFilter] = useState<string>()

  // filters
  if (pairFilter !== 'all') {
    singleData = singleData.filter(
      (pool) => pool?.TokenInfo?.token?.symbol.toLowerCase() === pairFilter || pool?.TokenInfo?.token?.symbol.toLowerCase() === pairFilter,
    )
  }

  if (dexFilter !== 'all') {
    singleData = singleData.filter(
      (pool) =>
        pool?.lpExchange === dexFilter
    )
  }

  console.info('singlesData', singlesData)
  return (
    <Page>
      <Section>
        <SBBox
          className="block"
          style={{ position: 'relative', marginRight: '30px', display: 'flex', alignItems: 'center' }}
        >
          <h2 style={{ color: 'white', fontSize: '60px', marginLeft: '80px', fontWeight: 800 }}>
            Huski
            <br /> Finance
          </h2>
        </SBBox>

        <Flex
          className="container"
          style={{
            padding: '30px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
            borderRadius: '15px',
            width: '20%',
          }}
        >
          <img src="/images/crown.png" width="48px" height="48px" alt="" />
          <Text mt="10px" fontSize="13px" fontWeight="600">
            {t('HUSKI Rewards')}
          </Text>
          <Flex justifyContent="space-between" flexDirection="column" alignItems="flex-start">
            <Text mb="5px" color="textFarm" fontWeight="700" fontSize="28px">
              {reward.toPrecision(3)}
            </Text>
            <StyledButton
              as={Link}
              to={(location) => ({ pathname: `${location.pathname}/claim`, state: { farmsData } })}
              disabled={!account}
              scale="sm"
            >
              <Text color="textSubtle">{t('Claim')}</Text>
            </StyledButton>
          </Flex>
        </Flex>
      </Section>


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

      <FiltersWrapper >
        <Flex alignItems="center" className="dexFilter" justifyContent="center" borderRight="2px solid #EFEFEF;">
          <Text bold >DEX:</Text>
          <Flex overflowX="auto" paddingLeft="5px">
            <FilterOption
              variant="tertiary"
              style={{ width: '60px', height: '30px', justifySelf: 'flex-end', }}
              isActive={dexFilter === 'all'}
              onClick={() => setDexFilter('all')}
            >
              {t('All')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content', height: '30px', justifySelf: 'flex-end', }}
              startIcon={<PancakeSwapIcon />}
              isActive={dexFilter === 'PancakeSwap'}
              onClick={() => setDexFilter('PancakeSwap')}
            >
              PancakeSwap
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content', height: '30px', justifySelf: 'flex-end', }}
              startIcon={<img src="/images/Uniswap.svg" width='32px' height='32px' alt="" />}
              isActive={dexFilter === 'UniSwap'}
              onClick={() => setDexFilter('UniSwap')}
            >
              UniSwap
            </FilterOption>
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="center" borderRight="2px solid #EFEFEF;" style={{ paddingRight: "40px", paddingLeft: "50px" }}>
          <Text>{t('Strategy:')}</Text>
          <Flex overflowX="auto" alignItems="center">
            <FilterOption
              style={{ height: '30px' }}
              variant="tertiary"
              isActive={strategyFilter === 'bear'}
              onClick={() => setStrategyFilter('bear')}
              startIcon={<StrategyIcon market="bear" />}
            >
              Bear
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ height: '30px' }}
              isActive={strategyFilter === 'bull'}
              onClick={() => setStrategyFilter('bull')}
              startIcon={<StrategyIcon market="bull" />}
            >
              Bull
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ height: '30px' }}
              isActive={strategyFilter === 'neutral'}
              onClick={() => setStrategyFilter('neutral')}
              startIcon={<StrategyIcon market="neutral" />}
            >
              Neutral
            </FilterOption>
          </Flex>
        </Flex>
      </FiltersWrapper>
      <CardsWrapper>
        {singlesData?.map((asset) => (
          <SingleAssetsCard
            data={asset}
            key={asset?.name}
            strategyFilter={strategyFilter}
          />
        ))}
      </CardsWrapper>
    </Page>
  )
}

export default SingleAssetsFarms