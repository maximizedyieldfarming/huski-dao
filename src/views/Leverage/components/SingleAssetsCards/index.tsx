/* eslint-disable no-restricted-properties */
import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
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



const CardBody = styled(UiKitCardBody)`
  .avgContainer {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.textSubtle}26`};
    padding-bottom: 0.5rem;
  }
`
const AssetSelect = styled(Flex)`
`
const SingleAssetsCard = ({ data }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const { singleLeverage } = data

  const [selectedPool, setSelectedPool] = useState(0)
  const { liquidationThreshold, quoteTokenLiquidationThreshold, tokenAmountTotal, quoteTokenAmountTotal } = data.farmData[selectedPool]
  const tokenSymbol = data.farmData[selectedPool]?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
  const quoteTokenSymbol = data.farmData[selectedPool]?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')

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
    const dailyEarnings = apr / 365 * parseFloat(quoteTokenAmountTotal) / parseFloat(tokenAmountTotal)
    return dailyEarnings
  }

  const tvl = totalTvl.toNumber()
  const apy = getDisplayApr(getApy(singleLeverage))
  const apyOne = getDisplayApr(getApy(1))
  const risk = parseInt(liquidationThreshold) / 100 / 100
  const dailyEarnings = getDailyEarnings(singleLeverage)
  const riskLevel = (() => {
    if (data.marketStrategy === 'Bear') {
      return 'High'
    }
    if (data.marketStrategy === 'Bull') {
      return 'Moderate'
    }
    if (data.marketStrategy === 'Neutral') {
      return 'Low'
    }
    return null
  })()

  const avgApy = Number(apy) - Number(apyOne)
  let tcolor;
  if (data.marketStrategy === "Bull")
    tcolor = "#83BF6E";
  if (data.marketStrategy === "Bear")
    tcolor = "#FE7D5E";
  if (data.marketStrategy === "Neutral")
    tcolor = "#F0B90B";
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
      color: [tcolor],
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
                color: tcolor,
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
      label: item.QuoteTokenInfo?.name?.replace(' PancakeswapWorker', ' Pancakeswap').replace('WBNB', 'BNB'),
      value: index,
    })
  })
  return (
    <Card>
      <CardHeader data={data} pool={selectedPool} />
      <CardBody>
        <Box className="avgContainer">
          <Flex alignItems="center" flexDirection="column">
            <Flex width="100%" background={`${tcolor}1A`} height="80px" border={`1px solid  ${tcolor}`} borderRadius="10px" justifyContent="space-between">
              <Flex alignItems="center" width="calc(100% - 20px)">
                <TokenPairImage
                  variant="inverted"
                  primaryToken={data.farmData[0].QuoteTokenInfo.token}
                  secondaryToken={data.farmData[0].QuoteTokenInfo.quoteToken}
                  width={44}
                  height={44}
                  primaryImageProps={{ style: { marginLeft: "20px" } }}
                  ml="20px"
                />
                <Flex flexDirection="column" marginLeft="30px">
                  <Text color="#131313" fontSize="18px" fontWeight="600">{data.marketStrategy} Strategy <span style={{ fontSize: "20px", fontWeight: "normal" }}>{singleLeverage}x</span></Text>
                  <Text color="#6F767E" fontSize="12px" fontWeight="500">{selectOptions && selectOptions[0].label}</Text>
                </Flex>
              </Flex>
              <Flex marginRight="5px"><ChevronDownIcon width="25px" /></Flex>
            </Flex>
          </Flex>
          <Grid gridTemplateColumns="1fr 1fr">
            <Flex flexDirection="column" justifyContent="center">
              <Text>{t('APY')}</Text>

              <Text bold fontSize="3">
                {Number(avgApy).toFixed(2)}%
              </Text>
              <Flex alignItems="center" >
                <ArrowUpIcon width="13px" color={tcolor} />
                <Text fontSize="13px" color={tcolor}>
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
            <Text color={tcolor} fontWeight="bold">{riskLevel}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Daily Earn')}</Text>
            <Text>{dailyEarnings.toFixed(4)} {quoteTokenSymbol} Per {tokenSymbol}</Text>
          </Flex>
        </Box>
        <Flex justifyContent="center">
          <Button
            width="100%"
            as={Link}
            to={(location) => ({
              ...location,
              pathname: `${location.pathname}/farm/${data?.farmData[selectedPool]?.lpSymbol.replace(' LP', '')}`,
              state: {
                data: data?.farmData[selectedPool],
                singleLeverage: data?.singleLeverage,
                marketStrategy: data?.marketStrategy,
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