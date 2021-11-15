/* eslint-disable no-restricted-properties */
import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { CardBody as UiKitCardBody, Flex, Text, Button, Box, Grid, Skeleton } from 'husky-uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import * as echarts from 'echarts'
import ReactEcharts from 'echarts-for-react'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import nFormatter from 'utils/nFormatter'
import Select from 'components/Select/Select'
import { getHuskyRewards, getYieldFarming, getTvl, getBorrowingInterest } from '../../helpers'
import { Card } from './Card'
import CardHeader from './CardHeader'

const CardBody = styled(UiKitCardBody)`
  .avgContainer {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.textSubtle}26`};
    padding-bottom: 0.5rem;
  }
`

const SingleAssetsCard = ({ data }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const { singleLeverage } = data

  const [selectedPool, setSelectedPool] = useState(0)
  const { liquidationThreshold, quoteTokenLiquidationThreshold, tokenAmountTotal, quoteTokenAmountTotal } = data.farmData[selectedPool]
  const tokenSymbol =   data.farmData[selectedPool]?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const quoteTokenSymbol =   data.farmData[selectedPool]?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [borrowingAsset, setBorrowingAsset] = useState(data.farmData[selectedPool]?.TokenInfo?.token?.symbol)
  const { totalTvl } = getTvl(data.farmData[selectedPool])
  const huskyRewards = getHuskyRewards(data.farmData[selectedPool], huskyPrice, borrowingAsset)
  const yieldFarmData = getYieldFarming(data.farmData[selectedPool], cakePrice)
  const { borrowingInterest } = getBorrowingInterest(data.farmData[selectedPool], borrowingAsset)

  const getApr = (lvg) => {
    const apr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((data.farmData[selectedPool].tradeFee * 365) / 100) * lvg) +
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
    const dailyEarnings = apr / 365 * parseFloat(tokenAmountTotal) / parseFloat(quoteTokenAmountTotal)
    return dailyEarnings
  }

  const tvl = totalTvl.toNumber()
  const apy = getDisplayApr(getApy(singleLeverage))
  const apyOne = getDisplayApr(getApy(1))
  const risk = parseInt(liquidationThreshold) / 100 / 100
  const riskLevel = risk
  const dailyEarnings = getDailyEarnings(singleLeverage)
  const avgApy = Number(apy) - Number(apyOne)

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
      color: ['#B1EAFA'],
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
                color: '#B1EAFA',
              },
              {
                offset: 1,
                color: '#FFFFFF',
              },
            ]),
          },
        },
      ],
    }
    return option
  }

  const selectOptions = []
  data.farmData?.forEach((item, index) => {
    selectOptions.push({
      label: item.QuoteTokenInfo?.name?.replace(' PancakeswapWorker', '').replace('WBNB', 'BNB'),
      value: index,
    })
  })

  return (
    <Card>
      <CardHeader data={data} pool={selectedPool} />
      <CardBody>
        <Box className="avgContainer">
          <Flex alignItems="center">
            <Text>{t('7Days Average APY')}</Text>
            <Select options={selectOptions} onChange={(option) => setSelectedPool(option.value)} />
          </Flex>
          <Grid gridTemplateColumns="1fr 1fr">
            <Flex flexDirection="column" justifyContent="center">
              <Text bold fontSize="3" mb="1rem">
                {Number(avgApy).toFixed(2)}%
              </Text>
              <Text>{t(`than 1x yield farm`)}</Text>
            </Flex>
            {/* graph */}
            <ReactEcharts option={getOption()} theme="Imooc" style={{ height: '200px' }} />
          </Grid>
        </Box>
        <Box padding="0.5rem 0">
          <Flex justifyContent="space-between">
            <Text>{t('TVL')}</Text>
            {tvl && !Number.isNaN(tvl) && tvl !== undefined ? (
              <Text>{nFormatter(tvl)}</Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('APY')}</Text>
            <Text>{Number(apy).toFixed(2)}%</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Risk Level')}</Text>
            <Text>{riskLevel}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Daily Earnings')}</Text>
            <Text>{dailyEarnings} {quoteTokenSymbol} Per {tokenSymbol}</Text>
          </Flex>
        </Box>
        <Flex justifyContent="center">
          <Button
            scale="sm"
            as={Link}
            to={(location) => ({
              ...location,
              pathname: `${location.pathname}/farm/${data?.farmData[selectedPool]?.lpSymbol.replace(' LP', '')}`,
              state: { data: data?.farmData[selectedPool], singleLeverage: data?.singleLeverage },
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
