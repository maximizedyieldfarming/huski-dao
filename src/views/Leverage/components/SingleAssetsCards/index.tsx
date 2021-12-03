/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
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
const AssetSelect = styled(Flex)`
`
const SingleAssetsCard: React.FC<Props> = ({ data, strategyFilter }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  // const { singleLeverage } = data

  const [selectedPool, setSelectedPool] = useState(0)
  const { liquidationThreshold, quoteTokenLiquidationThreshold, tokenAmountTotal, quoteTokenAmountTotal } = data
  const tokenSymbol = data?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const quoteTokenSymbol = data?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [borrowingAsset, setBorrowingAsset] = useState(data.TokenInfo?.token?.symbol)
  const { totalTvl } = getTvl(data)
  const huskyRewards = getHuskyRewards(data, huskyPrice, borrowingAsset)
  const yieldFarmData = getYieldFarming(data, cakePrice)
  const { borrowingInterest } = getBorrowingInterest(data, borrowingAsset)

  const getApr = (lvg) => {
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((data.tradeFee * 365) / 100) * lvg) +
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
    data?.TokenInfo?.token?.symbol.toUpperCase() === 'ALPACA' ? 'neutral' : 'bull2x',
  )

  const getSelectOptions = React.useCallback(() => {
    if (strategyFilter === 'neutral') {
      return [
        {
          value: 'neutral',
          label: 'Neutral strategy 2x',
        },
        {
          value: 'bear',
          label: 'Bear strategy 2x',
        },
        {
          value: 'bull2x',
          label: 'Bull Strategy 2x',
        },
        {
          value: 'bull3x',
          label: 'Bull Strategy 3x',
        },
      ]
    }
    if (strategyFilter === 'bear') {
      return [
        {
          value: 'bear',
          label: 'Bear strategy 2x',
        },
        {
          value: 'bull2x',
          label: 'Bull Strategy 2x',
        },
        {
          value: 'bull3x',
          label: 'Bull Strategy 3x',
        },
        {
          value: 'neutral',
          label: 'Neutral strategy 2x',
        },
      ]
    }
    if (strategyFilter === 'bull2x') {
      return [
        {
          value: 'bull2x',
          label: 'Bull Strategy 2x',
        },
        {
          value: 'bull3x',
          label: 'Bull Strategy 3x',
        },
        {
          value: 'bear',
          label: 'Bear strategy 2x',
        },
        {
          value: 'neutral',
          label: 'Neutral strategy 2x',
        },
      ]
    }

    if (data?.TokenInfo?.token?.symbol.toUpperCase() === 'ALPACA') {
      return [
        {
          value: 'neutral',
          label: 'Neutral strategy 2x',
        },
        {
          value: 'bear',
          label: 'Bear strategy 2x',
        },
        {
          value: 'bull2x',
          label: 'Bull Strategy 2x',
        },
        {
          value: 'bull3x',
          label: 'Bull Strategy 3x',
        },
      ]
    }
    const selOptions = []
    strategies.forEach((strat) => {
      selOptions.push({
        label: strat.name,
        value: strat.value,
      })
    })
    return selOptions
  }, [strategies, data, strategyFilter])

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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
          symbol: 'none', // no point
          type: 'line',
          data: [1000, 2000, 1500, 3000, 2000, 1200, 800],

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
        top: 0,
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
    if (selectedStrategy === 'bear') {
      return '#FE6057'
    }
    return '#FCBD2C'
  })()

  const handleSelectChange = (option) => {
    setSelectedStrategy(option.value)
  }

  return (
    <Card>
      <CardHeader data={data} pool={selectedPool} />
      <CardBody>
        <Box className="avgContainer">
        {/*   <Flex alignItems="center" flexDirection="column">
            <Flex
              width="100%"
              background={`${color}1A`}
              height="80px"
              border={`1px solid  ${color}`}
              borderRadius="10px"
              justifyContent="space-between"
            >
              <Flex alignItems="center" width="calc(100% - 20px)">
                <TokenPairImage
                  variant="inverted"
                  primaryToken={data.QuoteTokenInfo.token}
                  secondaryToken={data.QuoteTokenInfo.quoteToken}
                  width={44}
                  height={44}
                  primaryImageProps={{ style: { marginLeft: '20px' } }}
                  ml="20px"
                />
                 <Flex flexDirection="column" marginLeft="30px">
                  <Text color="#131313" fontSize="18px" fontWeight="600">{data.marketStrategy} Strategy <span style={{ fontSize: "20px", fontWeight: "normal" }}>{singleLeverage}x</span></Text>
                  <Text color="#6F767E" fontSize="12px" fontWeight="500">{getSelectOptions()[0].label}</Text>
                </Flex> 
              </Flex>
              <Flex marginRight="5px">
                <ChevronDownIcon width="25px" />
              </Flex>
            </Flex>
          </Flex> */}
                <Select options={getSelectOptions()} onChange={handleSelectChange} />
          <Grid gridTemplateColumns="1fr 1fr">
            <Flex flexDirection="column" justifyContent="center">
              <Text>{t('APY')}</Text>

              <Text bold fontSize="3">
                {Number(avgApy).toFixed(2)}%
              </Text>
              <Flex alignItems="center">
                <ArrowUpIcon width="13px" color={color} />
                <Text fontSize="13px" color={color}>
                  {Number(avgApy).toFixed(2)}%
                </Text>
                <Text fontSize="13px">{t(` than 1x yield farm`)}</Text>
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
              pathname: `${location.pathname}/farm/${data?.lpSymbol.replace(' LP', '')}`,
              state: {
                data,
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