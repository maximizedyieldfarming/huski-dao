/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import {
  CardBody as UiKitCardBody,
  Flex,
  Text,
  Skeleton,
  Button,
  Box,
  Grid,
  ChevronDownIcon,
  useMatchBreakpoints,
} from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from 'contexts/Localization'
import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { useCakePrice, useHuskiPrice, usePriceList } from 'hooks/api'
import useTheme from 'hooks/useTheme'
import nFormatter from 'utils/nFormatter'
import { useFarmsWithToken } from '../../hooks/useFarmsWithToken'
import { useTradingFees, useTradingFees7days } from '../../hooks/useTradingFees'
import { useBorrowingInterest7days } from '../../hooks/useBorrowingInterest7days'
import { getHuskyRewards, getYieldFarming, getTvl, getSingle7Days } from '../../helpers'
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

const DropDown = styled.div<{ isselect: boolean }>`
  border-radius: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15);
  z-index: 1;
  width: 60%;
  position: absolute;
  left: 40%;
  top: 90px;
  max-height: ${({ isselect }) => {
    if (isselect) {
      return '330px'
    }
    return '0px'
  }};
  overflow-y: ${({ isselect }) => {
    if (isselect) {
      return 'scroll'
    }
    return 'hidden'
  }};
  transition: max-height 0.3s;
`

const DropDownItem = styled(Flex)`
  :hover {
    background: lightgrey;
  }
`

const StrategyIcon = styled.div<{ market: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: ${({ market }) => {
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
const SingleAssetsCard: React.FC<Props> = ({ data, strategyFilter }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const [singleData, setSingleData] = useState<any>(data?.singleArray[0])
  const { isDark } = useTheme()

  const { tradingFees7Days } = useTradingFees7days(singleData)
  const { tokenAmountTotal, quoteTokenAmountTotal } = singleData
  const tokenSymbol = singleData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
  const quoteTokenSymbol = singleData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const borrowingAsset = singleData.TokenInfo?.token?.symbol
  const { totalTvl } = getTvl(singleData)
  const huskyRewards = getHuskyRewards(singleData, huskyPrice, borrowingAsset)
  const yieldFarmData = getYieldFarming(singleData, cakePrice)
  // const { borrowingInterest } = getBorrowingInterest(singleData, borrowingAsset)
  const { borrowingInterest } = useFarmsWithToken(singleData, borrowingAsset)
  const { tradingFees: tradeFee } = useTradingFees(singleData)
  const dropdown = useRef(null)

  const getApr = (lvg) => {
    if (
      Number(tradeFee) === 0 ||
      Number(huskyRewards) === 0 ||
      Number(borrowingInterest) === 0 ||
      Number(yieldFarmData) === 0 ||
      Number.isNaN(tradeFee) ||
      Number.isNaN(huskyRewards) ||
      Number.isNaN(borrowingInterest) ||
      Number.isNaN(yieldFarmData)
    ) {
      return null
    }
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return apr
  }

  const getApy = (lvg) => {
    const apr = getApr(lvg)
    if (apr === null) {
      return null
    }
    const apy = Math.pow(1 + apr / 365, 365) - 1
    return apy * 100
  }

  const getDailyEarnings = (lvg) => {
    const apr = getApr(lvg)
    const dailyEarnings = ((apr / 365) * parseFloat(quoteTokenAmountTotal)) / parseFloat(tokenAmountTotal)
    return dailyEarnings
  }

  const { priceList: cakePriceList } = usePriceList('pancakeswap-token')

  const singleApyList = getSingle7Days(singleData, cakePriceList, tradingFees7Days)

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

    return selOptions
  }, [strategies, data])

  useEffect(() => {
    setSelectedStrategy((prevState) => strategyFilter || prevState)
  }, [strategyFilter])

  const { singleLeverage, riskLevel, name: strategyName } = getStrategyInfo(selectedStrategy)

  const tvl = totalTvl.toNumber()
  const apy = getDisplayApr(getApy(singleLeverage))
  const apyOne = getDisplayApr(getApy(1))
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
          // data: [1000, 2000, 1500, 2000, 2000, 1200, 800],
          data: singleApyList,
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
        top: 20,
        right: 0,
        bottom: 10,
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
  })()

  let soption
  getSelectOptions().map((d) => {
    if (d.value === selectedStrategy) soption = d.label.split(' +')[0]
    return ''
  })

  // const [selectedoption, setSelectedOption] = useState(soption)
  const handleSelectChange = (option) => {
    const lpSymbol = option.label.split('+ ').pop()
    setSingleData(data.singleArray.find((single) => single.lpSymbol === lpSymbol))
    setSelectedStrategy(option.value)
    // setSelectedOption(option.label.split(' +')[0])
  }

  const [isselect, setIsSelect] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', (event) => {
      if (dropdown.current && isselect && !dropdown.current.contains(event.target)) {
        setIsSelect(false)
      }
    })
  }, [isselect])
  // console.log('singleData', singleData, "selectedStrategy", selectedStrategy);
  let prevpair

  // because of useState for setting which token pair and strategy is being used,
  // the data inside the card gets stale (doesn't update) this forces it to update
  // if theres not apy data,
  // console.log("data", {data})
  useEffect(() => {
    if (!apy) {
      setSingleData((prev) => data?.singleArray.find((item) => item?.pid === prev?.pid))
    }
  }, [data, apy])

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  return (
    <Card>
      <CardHeader data={singleData} />
      <CardBody>
        <Box className="avgContainer">
          <Flex alignItems="center" flexDirection="column">
            <Box style={{ position: 'relative', width: '100%' }} ref={dropdown}>
              <Flex
                onClick={() => setIsSelect(!isselect)}
                style={{ cursor: 'pointer' }}
                background={`${color}1A`}
                height="80px"
                border={`1px solid  ${color}`}
                borderRadius="10px"
                justifyContent="space-between"
              >
                <Flex alignItems="center" width="calc(100% - 20px)">
                  <TokenPairImage
                    primaryToken={singleData.QuoteTokenInfo.quoteToken}
                    secondaryToken={singleData.QuoteTokenInfo.token}
                    width={44}
                    height={44}
                    primaryImageProps={{ style: { marginLeft: '20px' } }}
                    ml="20px"
                  />
                  <Flex flexDirection="column" marginLeft="30px">
                    <Text fontSize={isSmallScreen ? '1rem' : '18px'} fontWeight="600" textTransform="capitalize">
                      {strategyName}
                    </Text>
                    <Text color="#6F767E" fontSize="12px" fontWeight="500">{`${singleData?.lpSymbol.replace(
                      ' LP',
                      '',
                    )} ${singleData?.lpExchange}`}</Text>
                  </Flex>
                </Flex>
                <Flex marginRight="5px">
                  <ChevronDownIcon width="25px" />
                </Flex>
              </Flex>
              <DropDown isselect={isselect}>
                {getSelectOptions().map((option, i) => {
                  const symbol = option.label.split('+ ')[1]
                  let f = 0
                  if (symbol !== prevpair) {
                    f = 1
                    prevpair = symbol
                  }
                  return (
                    <>
                      {f === 1 && (
                        <Flex height="50px" background={isDark ? '#070707' : '#F8F8F8'} alignItems="center" pl="12px">
                          <TokenPairImage
                            variant="inverted"
                            primaryToken={
                              data.singleArray.find((single) => single.lpSymbol === symbol).QuoteTokenInfo.token
                            }
                            secondaryToken={
                              data.singleArray.find((single) => single.lpSymbol === symbol).QuoteTokenInfo.quoteToken
                            }
                            width={28}
                            height={28}
                            primaryImageProps={{ style: { marginLeft: '4px' } }}
                            ml="20px"
                          />
                          <Text color="#6F767E" fontWeight="600" ml="10px">
                            {symbol.replace(' LP', '')}
                          </Text>
                        </Flex>
                      )}
                      <Box background={isDark ? '#111315' : '#FFFFFF'}>
                        <DropDownItem
                          padding="10px 20px 10px 27px"
                          alignItems="center"
                          onClick={() => {
                            setIsSelect(false)
                            handleSelectChange(option)
                          }}
                        >
                          <Box mr="20px">
                            <StrategyIcon market={option.label.split(' ')[0].toLowerCase()} />
                          </Box>
                          <Flex justifyContent="space-between" style={{ cursor: 'pointer' }} width="100%">
                            <Text fontSize="1rem" color={isDark ? 'white' : 'black'}>
                              {option.label.split(' ')[0]} {option.label.split(' ')[1]}
                            </Text>
                            <Text fontSize="1rem" color={isDark ? 'white' : 'black'}>
                              {option.label.split(' ')[2]}
                            </Text>
                          </Flex>
                        </DropDownItem>
                      </Box>
                    </>
                  )
                })}
              </DropDown>
            </Box>
          </Flex>

          <Grid gridTemplateColumns="1fr 1fr" paddingTop="20px">
            <Flex flexDirection="column" justifyContent="center">
              <Text color="#6F767E" fontSize="13px" mb="5px">
                {t('APY')}
              </Text>
              {apy ? (
                <>
                  <Text bold fontSize="3">
                    {apy}%
                  </Text>
                  <Flex alignItems="center" my="5px">
                    {/*                     <Text color="#27C73F">{apyPercentageDiff}</Text>
                    <ArrowUpIcon color="#27C73F" /> */}
                    <Text>
                      {t(
                        `%apyPercentageDiff% ${
                          Number(apyPercentageDiff) > Number(apyOne) ? '\u2191' : '\u2193'
                        } than 1x yield farm`,
                        { apyPercentageDiff },
                      )}
                    </Text>
                  </Flex>
                </>
              ) : (
                <>
                  <Skeleton width="5rem" height="1rem" mb="1rem" />
                  <Skeleton width="8rem" height="1rem" />
                </>
              )}
            </Flex>
            <ReactEcharts option={getOption()} theme="Imooc" style={{ height: '76px' }} />
          </Grid>
        </Box>
        <Box padding="0.5rem 0">
          <Flex justifyContent="space-between" my="12px">
            <Text color="#6F767E">{t('TVL')}</Text>
            {tvl && !Number.isNaN(tvl) && tvl !== undefined ? (
              <Text>{`$${nFormatter(tvl)}`}</Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>

          <Flex justifyContent="space-between" my="12px">
            <Text color="#6F767E">{t('Risk Level')}</Text>
            <Text color={color} fontWeight="bold">
              {riskLevel}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" my="12px">
            <Text color="#6F767E">{t('Daily Earn')}</Text>
            {dailyEarnings ? (
              <Text>
                {t('%dailyEarnings% %quoteTokenSymbol% per %tokenSymbol%', {
                  dailyEarnings: dailyEarnings.toFixed(4),
                  quoteTokenSymbol,
                  tokenSymbol,
                })}
              </Text>
            ) : (
              <Skeleton width="5rem" height="1rem" />
            )}
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
                marketStrategy: selectedStrategy,
              },
            })}
            disabled={!account || !apy}
            onClick={(e) => !account || (!apy && e.preventDefault())}
          >
            {t('Farm')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SingleAssetsCard
