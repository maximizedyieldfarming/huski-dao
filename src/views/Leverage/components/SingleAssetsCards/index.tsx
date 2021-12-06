/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { CardBody as UiKitCardBody, Flex, Text, CardRibbon, Skeleton, Button, Box, Grid, ChevronDownIcon, ArrowUpIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import { TokenPairImage, TokenImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatBigNumber } from 'state/utils'
import Select from 'components/Select/Select'
import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import nFormatter from 'utils/nFormatter'
import { useFarmsWithToken } from '../../hooks/useFarmsWithToken'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
import { Card } from './Card'
import CardHeader from './CardHeader'

interface Props {
  data: any
  strategyFilter: string
}

const CardBody = styled(UiKitCardBody)`
  .avgContainer {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.textSubtle}26`};
    padding-bottom: 0.5rem;
  }
`

const DropDownItem = styled(Flex)`
  :hover{
    background : lightgrey
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
const AssetSelect = styled(Flex)`
`
const SingleAssetsCard: React.FC<Props> = ({ data, strategyFilter }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const [singleData, setSingleData] = useState<any>(data?.singleArray[0])

  console.info('data', data)
  console.info('singleData', singleData)


  const [selectedPool, setSelectedPool] = useState(0)
  const { liquidationThreshold, quoteTokenLiquidationThreshold, tokenAmountTotal, quoteTokenAmountTotal } = singleData
  const tokenSymbol = singleData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const quoteTokenSymbol = singleData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [borrowingAsset, setBorrowingAsset] = useState(singleData.TokenInfo?.token?.symbol)
  const { totalTvl } = getTvl(singleData)
  const huskyRewards = getHuskyRewards(singleData, huskyPrice, borrowingAsset)
  const yieldFarmData = getYieldFarming(singleData, cakePrice)
  // const { borrowingInterest } = getBorrowingInterest(singleData, borrowingAsset)
  const { borrowingInterest } = useFarmsWithToken(singleData, borrowingAsset)
  const dropdown = useRef(null);
 

  const getApr = (lvg) => {
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((singleData.tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return apr
  }

  const getApy = (lvg) => {
    const apr = getApr(lvg)
    const apy = Math.pow(1 + apr / 365, 365) - 1
    return apy * 100
  }

  const getDailyEarnings = (lvg) => {
    const apr = getApr(lvg)
    const dailyEarnings = ((apr / 365) * parseFloat(quoteTokenAmountTotal)) / parseFloat(tokenAmountTotal)
    return dailyEarnings
  }

  const strategies = React.useMemo(
    () => [
      {
        value: 'bull2x',
        name: 'Bull Strategy 2x',
        singleLeverage: 2,
        direction: 'long',
        riskLevel: 'Moderate',
      },
      {
        value: 'bull3x',
        name: 'Bull Strategy 3x',
        singleLeverage: 3,
        direction: 'long',
        riskLevel: 'High',
      },
      {
        value: 'neutral',
        name: 'Neutral strategy 2x',
        singleLeverage: 2,
        direction: 'short',
        riskLevel: 'Low',
      },
      {
        value: 'bear',
        name: 'Bear strategy 3x',
        singleLeverage: 3,
        direction: 'short',
        riskLevel: 'High',
      },
    ],
    [],
  )

  const getStrategyInfo = (strategy: string) => {
    const currStrat = strategies.find((s) => s.value === strategy)
    return {
      name: currStrat?.name,
      singleLeverage: currStrat?.singleLeverage,
      direction: currStrat?.direction,
      riskLevel: currStrat?.riskLevel,
    }
  }

  const [selectedStrategy, setSelectedStrategy] = useState(
    singleData?.TokenInfo?.token?.symbol.toUpperCase() === 'ALPACA' ? 'neutral' : 'bull2x',
  )

  const getSelectOptions = React.useCallback(() => {

    const selOptions = []
    data.singleArray.forEach((single) => {
      strategies.forEach((strat) => {
        selOptions.push({
          label: `${strat.name} + ${single?.lpSymbol}`,
          value: strat.value,
        })
      })
    })

    console.info('selOptions', selOptions)
    return selOptions
  }, [strategies, data])

  useEffect(() => {
    setSelectedStrategy((prevState) => strategyFilter || prevState)
    console.log(strategyFilter);
  }, [strategyFilter])

  const { singleLeverage, direction, riskLevel } = getStrategyInfo(selectedStrategy)

  const tvl = totalTvl.toNumber()
  const apy = getDisplayApr(getApy(singleLeverage))
  const apyOne = getDisplayApr(getApy(1))
  const risk = parseInt(liquidationThreshold) / 100 / 100
  const dailyEarnings = getDailyEarnings(singleLeverage)

  const avgApy = Number(apy) - Number(apyOne)
  const apyPercentageDiff = new BigNumber(avgApy).div(apyOne).times(100).toFixed(2, 1)

  const getOption = () => {
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: ['first day', 'second day', 'third day', 'fourth day', 'fifth day', 'sixth day', 'seventh day'],
        boundaryGap: false,
        show: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
        },
      },
      color: [color],
      series: [
        {
          symbol: 'none',
          type: 'line',
          data: [1000, 2000, 1500, 2000, 2000, 1200, 800],
          smooth: 0.3,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                // eslint-disable-next-line object-shorthand
                color: color,
              },
              {
                offset: 1,
                color: '#FFFFFF',
              },
            ]),
          },
        },
      ],
      grid: {
        left: 0,
        top: 1,
        right: 0,
        bottom: 0,
      },
    }
    return option
  }

  const color = (() => {
    if (selectedStrategy.includes('bull')) {
      return '#27C73F'
    }
    if (selectedStrategy.includes('bear')) {
      return '#FE6057'
    }
    return '#FCBD2C'
  })();

  let soption;
  getSelectOptions().map((d) => {
    if (d.value === selectedStrategy)
      soption = d.label.split(' +')[0];
    return "";
  })

  const [selectedoption, setSelectedOption] = useState(soption);
  const handleSelectChange = (option) => {
    const lpSymbol = option.label.split('+ ').pop()
    setSingleData(data.singleArray.find((single) => single.lpSymbol === lpSymbol))
    setSelectedStrategy(option.value);
    setSelectedOption(option.label.split(' +')[0]);
  }

  const [isselect, setIsSelect] = useState(false);

  useEffect(()=>{
    document.addEventListener('mousedown',function(event){
      if(dropdown.current && isselect && !dropdown.current.contains(event.target)){
        setIsSelect(false)
      }
    })
  },[isselect])
  console.log('singleData', singleData, "selectedStrategy", selectedStrategy);
  let prevpair;

  return (
    <Card>
      <CardHeader data={singleData} pool={selectedPool} />
      <CardBody>
        <Box className="avgContainer">
          <Flex alignItems="center" flexDirection="column">
            <Box style={{ position: "relative", width: "100%" }}ref = {dropdown}>
              <Flex onClick={() => { setIsSelect(!isselect) }} style={{ cursor: "pointer" }} background={`${color}1A`} height="80px" border={`1px solid  ${color}`} borderRadius="10px" justifyContent="space-between">
                <Flex alignItems="center" width="calc(100% - 20px)">
                  <TokenPairImage
                    variant="inverted"
                    primaryToken={singleData.QuoteTokenInfo.token}
                    secondaryToken={singleData.QuoteTokenInfo.quoteToken}
                    width={44}
                    height={44}
                    primaryImageProps={{ style: { marginLeft: "20px" } }}
                    ml="20px"
                  />
                  <Flex flexDirection="column" marginLeft="30px">
                    <Text color="#131313" fontSize="18px" fontWeight="600">{selectedoption}</Text>
                    <Text color="#6F767E" fontSize="12px" fontWeight="500">{`${singleData?.lpSymbol.replace(' LP', '')} ${singleData?.lpExchange}`}</Text>
                  </Flex>
                </Flex>
                <Flex marginRight="5px"><ChevronDownIcon width="25px" /></Flex>
              </Flex>
              <Box  style={{ borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.15)", zIndex: 1, width: "60%", position: "absolute", left: "40%", top: "90px", maxHeight: isselect ? "330px" : "0px", overflow: isselect ? "scroll" : "hidden", transition: "max-height 0.3s" }}>
                {
                  getSelectOptions().map((option, i) => {
                    const symbol = option.label.split('+ ')[1];
                    let f = 0;
                    if (symbol !== prevpair) {
                      f = 1;
                      prevpair = symbol;
                    }
                    return <>{f === 1 && <Flex height="50px" background="#F8F8F8" alignItems="center" pl="12px">
                      <TokenPairImage
                        variant="inverted"
                        primaryToken={data.singleArray.find((single)=>single.lpSymbol === symbol).QuoteTokenInfo.token}
                        secondaryToken={data.singleArray.find((single)=>single.lpSymbol === symbol).QuoteTokenInfo.quoteToken}
                        width={28}
                        height={28}
                        primaryImageProps={{ style: { marginLeft: "4px" } }}
                        ml="20px"
                      />
                      <Text color="#6F767E" fontWeight="600" ml="10px">{symbol.replace(' LP', '')}</Text>
                    </Flex>}
                      <Box background="#FFFFFF" >

                        <DropDownItem padding="10px 20px 10px 27px" alignItems="center" onClick={() => { setIsSelect(false); handleSelectChange(option); }}>
                          <Box mr="20px"><StrategyIcon market={option.label.split(' ')[0].toLowerCase()} /></Box>
                          <Flex justifyContent="space-between" style={{ cursor: "pointer" }} width="100%">
                            <Text fontSize="16px">{option.label.split(' ')[0]} {option.label.split(' ')[1]}</Text>
                            <Text fontSize="16px">{option.label.split(' ')[2]}</Text>
                          </Flex>
                        </DropDownItem>

                      </Box>
                    </>
                  })}
              </Box>
            </Box>

          </Flex>

          <Grid gridTemplateColumns="1fr 1fr" paddingTop="20px">
            <Flex flexDirection="column" justifyContent="center">
              <Text>{t('APY')}</Text>

              <Text bold fontSize="3">
                {apy}%
              </Text>
              <Flex alignItems="center">
                <Text color="#27C73F">{apyPercentageDiff}</Text>
                <ArrowUpIcon color="#27C73F" />
                <Text>{t(` than 1x yield farm`)}</Text>
              </Flex>
            </Flex>
            {/* graph */}
            <ReactEcharts option={getOption()} theme="Imooc" style={{ height: '200px' }} />
          </Grid>
        </Box>
        <Box padding="0.5rem 0">
          <Flex justifyContent="space-between">
            <Text>{t('TVL')}</Text>
            {tvl && !Number.isNaN(tvl) && tvl !== undefined ? (
              <Text>${nFormatter(tvl)}</Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>

          <Flex justifyContent="space-between">
            <Text>{t('Risk Level')}</Text>
            <Text color={color} fontWeight="bold">
              {riskLevel}
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Daily Earn')}</Text>
            <Text>
              {dailyEarnings.toFixed(4)} {quoteTokenSymbol} Per {tokenSymbol}
            </Text>
          </Flex>
        </Box>
        <Flex justifyContent="center">
          <Button
            width="100%"
            as={Link}
            to={(location) => ({
              ...location,
              pathname: `${location.pathname}/farm/${singleData?.lpSymbol.replace(' LP', '')}`,
              state: {
                singleData,
                singleLeverage,
                marketStrategy: selectedStrategy,
              },
            })}
            disabled={!account || !apy}
            onClick={(e) => !account && e.preventDefault()}
          >
            {t('Farm')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SingleAssetsCard