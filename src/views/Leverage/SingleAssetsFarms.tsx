/* eslint-disable array-callback-return */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import styled from 'styled-components'
import { Box, Button, Flex, Text, CardsLayout } from '@huskifinance/huski-frontend-uikit'
import { PancakeSwapIcon } from 'assets'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import useTheme from 'hooks/useTheme'
// import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
// import { useGetPositions } from 'hooks/api'
// import { usePositions } from './hooks/usePositions'
import { usePositionsFormContract } from './hooks/usePositionsFormContract'
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
  border-bottom: ${({ isActive, theme }) => (isActive === 'true' ? `2px solid ${theme.colors.positions}` : 'unset')};
  color: ${({ isActive, theme }) => (isActive === 'true' ? theme.colors.positions : theme.colors.textSubtle)};
  font-size: 16px;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 1rem;
  }
  font-weight: 700;
  line-height: 19.36px;
  border-radius: unset;
  padding: unset;
  padding-bottom: 10px;
  &:first-child {
    margin-right: 1rem;
  }
`

const PositionButtonsContainer = styled(Box)`
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
  padding: 24px 24px;
`

const FilterOption = styled(Button)`
  padding: 10px;
  font-size: 13px;
  background-color: ${({ isActive }) => (isActive ? '#7B3FE4' : 'transparent')};
  // border-bottom: ${({ theme, isActive }) => (isActive ? `1px solid ${theme.colors.secondary}` : 'unset')};
  color: ${({ isActive }) => (isActive ? '#FFFFFF!important' : '#9D9D9D!important')};
  border-radius: 8px;
  color: #9d9d9d;
  > img {
    height: 26px;
    width: 26px;
    margin-right: 10px;
  }
  > svg {
    height: 26px;
    width: 26px;
    margin-right: 10px;
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
  padding: 18px 0px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  *::-webkit-scrollbar {
    height: 4px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    gap: 0;
  }
  > ${Flex} {
    padding-left: 24px;
    padding-right: 1rem;
    font-size: 16px;
  }
  .strategyFilter {
    ${({ theme }) => theme.mediaQueries.lg} {
      border-left: 2px solid #efefef;
      justify-content: left;
    }
  }
  .dexFilter {
    ${({ theme }) => theme.mediaQueries.lg} {
      justify-content: left;
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
  > h2 {
    font-family: 'BalooBhaijaan';
  }
  align-items: center;
  display: flex;

  border-radius: 15px !important;
  background-image: url('/images/BG.png');
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  width: calc(100% - 300px);
  min-width: 520px;
  padding-top: 30px;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
  @media screen and (max-width: 1480px) {
    padding: 30px 0px;
    margin-right: 0px !important;
  }
  @media screen and (max-width: 600px) {
    min-width: unset;
    > h2 {
      margin-left: 20px !important;
      font-size: 35px !important;
    }
  }
`

const Section = styled(Flex)`
  gap: 1rem;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
`

const StyledButton = styled(Button)`
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 32px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const SingleAssetsFarms: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  const { isDark } = useTheme()
  usePollLeverageFarmsWithUserData()

  const singleData = farmsData.filter((f) => f.singleFlag === 0)

  const bnbArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'wBNB')
  const btcbArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'BTCB')
  const ethArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'ETH')
  const huskiArray = singleData.filter((f) => f.TokenInfo.token.symbol === 'HUSKI')
  const cakeArray = singleData.filter((f) => f.TokenInfo.quoteToken.symbol === 'CAKE' && f.singleFlag === 0)

  let singlesData = []

  if (bnbArray && bnbArray !== null && bnbArray !== undefined && bnbArray !== [] && bnbArray.length !== 0) {
    const tokenObject = {
      name: 'BNB',
      singleArray: bnbArray,
    }
    singlesData.push(tokenObject)
  }
  if (btcbArray && btcbArray !== null && btcbArray !== undefined && btcbArray !== [] && btcbArray.length !== 0) {
    const tokenObject = {
      name: 'BTCB',
      singleArray: btcbArray,
    }
    singlesData.push(tokenObject)
  }
  if (ethArray && ethArray !== null && ethArray !== undefined && ethArray !== [] && ethArray.length !== 0) {
    const tokenObject = {
      name: 'ETH',
      singleArray: ethArray,
    }
    singlesData.push(tokenObject)
  }
  if (huskiArray && huskiArray !== null && huskiArray !== undefined && huskiArray !== [] && huskiArray.length !== 0) {
    const tokenObject = {
      name: 'HUSKI',
      singleArray: huskiArray,
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
    const tokenObject = {
      name: 'CAKE',
      singleArray: cakeArray,
    }
    singlesData.push(tokenObject)
  }

  // const data = useGetPositions(account)
  // const positionData = usePositions(data)
  const positionData = usePositionsFormContract(account)
  const positionFarmsData = []
  if (
    positionData &&
    positionData !== null &&
    positionData !== undefined &&
    positionData !== [] &&
    positionData.length !== 0
  ) {
    positionData.map((pdata) => {
      let pfarmData
      farmsData.map((farm) => {
        if ((
          farm.TokenInfo.address.toUpperCase() === pdata.worker.toUpperCase() ||
          farm.QuoteTokenInfo.address.toUpperCase() === pdata.worker.toUpperCase()) &&
          pdata.serialCode !== '1'
        ) {
          pfarmData = pdata
          pfarmData.farmData = farm
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  let reward = 0

  positionFarmsData.map((farm) => {
    const farmEarnings = new BigNumber(parseFloat(farm?.farmData?.userData?.farmEarnings))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    reward += farmEarnings
    return reward
  })

  const [dexFilter, setDexFilter] = useState('all')
  const [strategyFilter, setStrategyFilter] = useState<string>('')

  if (dexFilter !== 'all') {
    singlesData = singlesData.filter((pool) => pool?.singleArray[0]?.lpExchange === dexFilter)
  }
  console.info('singlesData', singlesData)

  if (!strategyFilter.includes('bull') && strategyFilter !== '') {
    singlesData = singlesData.filter((pool) => pool?.name !== 'CAKE')
  }
  return (
    <Page>
      <Section>
        <SBBox style={{ height: '180px' }}>
          <h2 style={{ color: 'white', fontSize: '60px', marginLeft: '80px', fontWeight: 800 }}>
            Huski Finance
          </h2>
        </SBBox>
        <Flex
          flex="1"
          style={{
            padding: '30px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '15px',
            background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
            maxWidth: '316px',
            height: '180px',
          }}
        >
          {/* <img src="/images/crown.png" width="48px" height="48px" alt="" /> */}
          <Text mt="10px" fontSize="16px" fontWeight="700">
            {t('HUSKI Rewards')}
          </Text>
          <Flex justifyContent="space-between" flexDirection="column" alignItems="flex-start">
            <Text mb="5px" color="textFarm" fontWeight="600" fontSize="36px">
              {new BigNumber(reward || 0).toFixed(3, 1)}
            </Text>
            <StyledButton
              as={Link}
              to={(location) => ({
                pathname: `${location.pathname.replace('singleAssets', 'farms')}/claim`,
                state: { farmsData },
              })}
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
        {isActivePos ? (
          <ActivePositionsTable positionFarmsData={positionFarmsData} />
        ) : (
          <LiquidatedPositionsTable data={null} />
        )}
      </StyledTableBorder>

      <FiltersWrapper>
        <Flex alignItems="left" className="dexFilter">
        <Text bold lineHeight="1.9">DEX :</Text>
          <Flex overflowX="auto" pl="10px">
            <FilterOption
              variant="tertiary"
              style={{ width: '60px', height: '30px', justifySelf: 'flex-start' }}
              isActive={dexFilter === 'all'}
              onClick={() => setDexFilter('all')}
            >
              {t('All')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content', height: '30px', justifySelf: 'flex-start' }}
              startIcon={<PancakeSwapIcon />}
              isActive={dexFilter === 'PancakeSwap'}
              onClick={() => setDexFilter('PancakeSwap')}
            >
              PancakeSwap
            </FilterOption>
            {/* <FilterOption
              variant="tertiary"
              style={{ width: 'fit-content', height: '30px', justifySelf: 'flex-end' }}
              startIcon={<img src="/images/Uniswap.svg" width="32px" height="32px" alt="" />}
              isActive={dexFilter === 'UniSwap'}
              onClick={() => setDexFilter('UniSwap')}
            >
              UniSwap
            </FilterOption> */}
          </Flex>
        </Flex>
        <Flex className="strategyFilter" alignItems="left" borderRight="none!important">
        <Text bold lineHeight="1.9">{t('Strategy :')}</Text>
          <Flex overflowX="auto" pl="10px" alignItems="left">
            <FilterOption
              style={{ height: '30px' }}
              variant="tertiary"
              isActive={strategyFilter === 'bear'}
              onClick={() => setStrategyFilter('bear')}
              startIcon={<StrategyIcon market="bear" />}
            >
              {t('Bear')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ height: '30px' }}
              isActive={strategyFilter === 'bull2x'}
              onClick={() => setStrategyFilter('bull2x')}
              startIcon={<StrategyIcon market="bull" />}
            >
              {t('Bull')}
            </FilterOption>
            <FilterOption
              variant="tertiary"
              style={{ height: '30px' }}
              isActive={strategyFilter === 'neutral'}
              onClick={() => setStrategyFilter('neutral')}
              startIcon={<StrategyIcon market="neutral" />}
            >
              {t('Neutral')}
            </FilterOption>
          </Flex>
        </Flex>
      </FiltersWrapper>
      <CardsLayout>
        {singlesData?.map((asset) => (
          <SingleAssetsCard data={asset} key={asset?.name} strategyFilter={strategyFilter} />
        ))}
      </CardsLayout>
    </Page>
  )
}

export default SingleAssetsFarms
