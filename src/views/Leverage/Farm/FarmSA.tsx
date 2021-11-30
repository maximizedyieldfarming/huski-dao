import React, { useState, useCallback, useRef } from 'react'
import { useParams, useLocation } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Radio,
  InfoIcon,
  Text,
  Skeleton,
  useTooltip,
  ArrowForwardIcon,
  useMatchBreakpoints,
  AutoRenewIcon,
} from 'husky-uikit1.0'
import { BalanceInput, ButtonMenu as UiKitButtonMenu, ButtonMenuItem as UiKitButtonMenuItem } from 'husky-uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { usePriceList, useCakePrice, useHuskiPrice } from 'hooks/api'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import ReactEcharts from 'echarts-for-react'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import { useWeb3React } from '@web3-react/core'
import Select from 'components/Select/Select'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getBorrowingInterest, getRunLogic, getRunLogic1 } from '../helpers'

interface LocationParams {
  data?: any
  singleLeverage?: number
  marketStrategy?: string
}

const Section = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;

  > ${Flex} {
    padding: 1.5rem 0;
    &:not(:last-child) {
      border-bottom: 1px solid #a41ff81a;
    }
  }

  input[type='range'] {
    -webkit-appearance: auto;
  }
`
const SectionWrapper = styled(Page)`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  > .sideSection {
    flex-direction: column;
    gap: 1rem;
  }
`

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`

const ButtonMenu = styled(UiKitButtonMenu)`
  background-color: unset;
  border: unset;
  width: 100%;
`

const ButtonMenuItem = styled(UiKitButtonMenuItem)`
  background-color: ${({ theme, isActive }) => (isActive ? theme.colors.gold : theme.colors.textSubtle)};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : theme.colors.text)};
  &:hover:not(:disabled):not(:active) {
    background-color: ${({ theme, isActive }) => (isActive ? theme.colors.gold : theme.colors.textSubtle)};
  }
  &:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  &:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  &:not(:last-child):not(:first-child) {
    border-radius: 0;
  }
`

const BalanceInputWrapper = styled(Flex)`
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 5px;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const FarmSA = () => {
  const { t } = useTranslation()
  const { isMobile, isTable } = useMatchBreakpoints()
  const isMobileOrTable = isMobile || isTable
  const { account } = useWeb3React()

  const {
    state: { data, singleLeverage, marketStrategy },
  } = useLocation<LocationParams>()

  const singleFarm = data
  console.info('singleFarm', singleFarm)
  const coingeckoId = singleFarm?.TokenInfo?.token?.coingeckoId
  const priceList = usePriceList(coingeckoId)

  const [selectedTokenInfo, setSelectedTokenInfo] = useState(singleFarm?.TokenInfo)
  const [selectedToken, setSelectedToken] = useState(singleFarm?.TokenInfo?.quoteToken)
  const [selectedStrategy, setSelectedStrategy] = useState<string>()

  let tokenName
  let quoteTokenName
  let riskKillThreshold

  if (marketStrategy === 'Bull') { // bull === 2x long
    tokenName = singleFarm?.QuoteTokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    quoteTokenName = singleFarm?.QuoteTokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    riskKillThreshold = singleFarm?.quoteTokenLiquidationThreshold
  } else { // 2x short || 3x short
    tokenName = singleFarm?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')
    quoteTokenName = singleFarm?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB')
    riskKillThreshold = singleFarm?.liquidationThreshold
  }

  const allowance = singleFarm?.userData?.quoteTokenAllowance

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState(false)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(selectedToken?.address))
  const userTokenBalance = Number(
    getBalanceAmount(selectedToken.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance).toJSON(),
  )

  const [inputValue, setInputValue] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)
  const handleInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setInputValue(finalValue)
      } else {
        event.preventDefault()
      }
      setButtonIndex(null)
    },
    [userTokenBalance],
  )
  const setInputToFraction = (index) => {
    if (index === 0) {
      setInputValue(userTokenBalance * 0.25)
      setButtonIndex(index)
    } else if (index === 1) {
      setInputValue(userTokenBalance * 0.5)
      setButtonIndex(index)
    } else if (index === 2) {
      setInputValue(userTokenBalance * 0.75)
      setButtonIndex(index)
    } else if (index === 3) {
      setInputValue(userTokenBalance)
      setButtonIndex(index)
    }
  }

  const { vaultAddress } = singleFarm?.TokenInfo
  const tokenAddress = getAddress(singleFarm?.TokenInfo?.token?.address)
  const quoteTokenAddress = getAddress(singleFarm?.TokenInfo?.quoteToken?.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const vaultContract = useVault(vaultAddress)


  const quoteTokenVaultAddress = singleFarm?.QuoteTokenInfo?.vaultAddress
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)


  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    let contract
    if (marketStrategy === 'Bull') {
      contract = approveContract
    } else {
      contract = quoteTokenApproveContract //  approveContract
    }

    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await contract.approve(vaultAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const huskyRewards = getHuskyRewards(singleFarm, huskyPrice, tokenName)
  const yieldFarmData = getYieldFarming(singleFarm, cakePrice)
  const { borrowingInterest } = getBorrowingInterest(singleFarm, tokenName)
  const { borrowingInterest: borrowingInterestQuoteToken } = getBorrowingInterest(singleFarm, quoteTokenName)

  const getApr = (lvg: number) => {
    const totalapr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((singleFarm?.tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return totalapr
  }
  const getApy = (lvg: number) => {
    const totalapr = getApr(lvg)
    // eslint-disable-next-line no-restricted-properties
    const totalapy = Math.pow(1 + totalapr / 365, 365) - 1
    return totalapy * 100
  }

  let tokenInputValue
  let quoteTokenInputValue

  if (selectedToken.symbol.replace('wBNB', 'BNB') !== tokenName) {
    tokenInputValue = 0;
    quoteTokenInputValue = inputValue
  } else {
    tokenInputValue = inputValue
    quoteTokenInputValue = 0;
  }

  const farmingData = getLeverageFarmingData(singleFarm, singleLeverage, tokenInputValue, quoteTokenInputValue, tokenName)
  const farmData = farmingData ? farmingData[1] : []
  const apy = getApy(singleLeverage)

  const selectOptions = []
  data.farmData?.forEach((item, index) => {
    selectOptions.push({
      label: item.lpSymbol.replace(' LP', ''),
      value: index,
    })
  })

  const balanceBigNumber = new BigNumber(userTokenBalance)
  let balanceNumber
  if (balanceBigNumber.lt(1)) {
    balanceNumber = balanceBigNumber
      .toNumber()
      .toFixed(
        singleFarm?.TokenInfo?.quoteToken?.decimalsDigits ? singleFarm?.TokenInfo?.quoteToken?.decimalsDigits : 2,
      )
  } else {
    balanceNumber = balanceBigNumber.toNumber().toFixed(2)
  }

  const handleFarm = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {

        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {

      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setInputValue(0)
      setButtonIndex(null)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder

    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    let contract
    let amount
    let workerAddress

    if (marketStrategy === 'Bull') { // bull === 2x long
      if (selectedToken.symbol.replace('wBNB', 'BNB') === tokenName) {  // token is farm token
        tokenInputValue = inputValue
        quoteTokenInputValue = 0;
        strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        tokenInputValue = 0;
        quoteTokenInputValue = inputValue
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }

      contract = quoteTokenVaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      workerAddress = singleFarm?.QuoteTokenInfo.address

    } else { // 2x short || 3x short
      if (selectedToken.symbol.replace('wBNB', 'BNB') === tokenName) {
        tokenInputValue = inputValue
        quoteTokenInputValue = 0;
        strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        tokenInputValue = 0;
        quoteTokenInputValue = inputValue
        farmingTokenAmount = Number(quoteTokenInputValue).toString()
        strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
      }
      contract = vaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInputValue)), 18).toString()
      workerAddress = singleFarm?.TokenInfo.address
    }

    console.log({
      tokenInputValue,
      quoteTokenInputValue,
      id,
      workerAddress,
      amount,
      loan,
      AssetsBorrowed,
      maxReturn,
      farmingTokenAmount,
      dataWorker,
      strategiesAddress,
      dataStrategy,
      inputValue,
    })

    handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  let borrowingInterestParam
  if (marketStrategy === 'Bull') { // bull === 2x long
    borrowingInterestParam = borrowingInterestQuoteToken
  } else { // 2x short || 3x short
    borrowingInterestParam = borrowingInterest
  }

  const { priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 } = getRunLogic(riskKillThreshold, getApr(1), singleLeverage)
  const { dateList, profitLossRatioToken0, profitLossRatioToken1 } = getRunLogic1(priceList, riskKillThreshold, borrowingInterestParam, getApr(1), singleLeverage)

  // for test data
  const xAxisdata = dateList

  const data1 = profitLossRatioToken0

  const data2 = profitLossRatioToken1

  const xAxisdata1 = priceRiseFall

  const data11 = profitLossRatioSheet1Token0

  const data22 = profitLossRatioSheet1Token1


  const getOption = () => {
    const option = {

      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisdata,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '邮件营销1',
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: 'red',
              borderColor: 'red',
            }
          },
          data: data1
        },
        {
          name: '视频广告',
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          color: ['blue'],
          data: data2
        },
      ]
    };

    return option
  }


  const getOption2 = () => {
    const option = {

      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisdata1,
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '邮件营销1',
          type: 'line',
          symbol: 'none',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: 'red',
              borderColor: 'red',
            }
          },
          data: data11
        },
        {
          name: '视频广告',
          type: 'line',
          stack: '总量',
          symbol: 'none',
          symbolSize: 8,
          color: ['blue'],
          data: data22
        },

      ]
    };

    return option
  }



  const { tooltip, targetRef, tooltipVisible } = useTooltip(<><Text>{t('text')}</Text></>, { placement: 'right' })
  return (
    <Page>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(
          `Farming ${singleFarm.QuoteTokenInfo.name
            .replace('WBNB', 'BNB')
            .replace(' PancakeswapWorker', '')} Pools`,
        )}
      </Text>
      <SectionWrapper>
        <Flex className="graphSide" flex="1">
        <Section>
            {/* <ReactHighstock option={getOption1()} style={{ height: '500px' }} /> */}

          </Section>
          <Section>
            <ReactEcharts option={getOption()} style={{ height: '500px' }} />
          </Section>
          <Section>
            <ReactEcharts option={getOption2()} style={{ height: '500px' }} />
          </Section>
        </Flex>
        <Flex className="infoSide" flex="1">
          <Section>
            <Box>
              <Flex alignItems="center" justifyContent="space-between">
                <Select
                  options={[
                    {
                      label: t('Bear Market Strategy'),
                      value: singleFarm?.TokenInfo?.quoteToken,
                    },
                    {
                      label: t('Bull Market Strategy'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                    {
                      label: t('Neutral Market Strategy'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                  ]}
                  onChange={(option) => {
                    setSelectedStrategy(option.value)
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center">
                <Text>{t('Collateral')}</Text>
                <Select
                  options={[
                    {
                      label: singleFarm?.TokenInfo?.quoteToken?.symbol.replace('wBNB', 'BNB'),
                      value: singleFarm?.TokenInfo?.quoteToken,
                    },
                    {
                      label: singleFarm?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB'),
                      value: singleFarm?.TokenInfo?.token,
                    },
                  ]}
                  onChange={(option) => {
                    setSelectedToken(option.value)
                    setInputValue(0)
                    setButtonIndex(null)
                  }}
                />
              </Flex>
              <Box>
                <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                  <BalanceInputWrapper alignItems="center" flex="1">
                    <NumberInput placeholder="0.00" value={inputValue} onChange={handleInput} />
                    <Flex alignItems="center">
                      <Box width={25} height={25} mr="5px">
                        <TokenImage token={selectedToken} width={25} height={25} />
                      </Box>
                      <Text mr="5px" small color="textSubtle">
                        {t('Balance:')}
                      </Text>

                      <Text small color="textSubtle">
                        {balanceNumber}
                      </Text>
                    </Flex>
                  </BalanceInputWrapper>
                </InputArea>
                <ButtonMenu
                  onItemClick={setInputToFraction}
                  activeIndex={buttonIndex}
                  disabled={Number(userTokenBalance) === 0}
                >
                  <ButtonMenuItem>25%</ButtonMenuItem>
                  <ButtonMenuItem>50%</ButtonMenuItem>
                  <ButtonMenuItem>75%</ButtonMenuItem>
                  <ButtonMenuItem>100%</ButtonMenuItem>
                </ButtonMenu>
              </Box>
            </Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Flex>
                <Text small>{t('APY')}</Text>
                {tooltipVisible && tooltip}
                <span ref={targetRef}>
                  <InfoIcon ml="10px" />
                </span>
              </Flex>
              <Text>{apy.toFixed(2)}%</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Debt Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(2)} {tokenName}
                </Text>
              ) : (
                <Text>0.00 {tokenName}</Text>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Position Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[8].toFixed(2)} {tokenName} + {farmData[9].toFixed(2)} {quoteTokenName}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex>
              {isApproved ? (
                <Button
                  mx="auto"
                  scale="sm"
                  onClick={handleConfirm}
                  isLoading={isPending}
                  endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                  disabled={
                    !account ||
                    !isApproved ||
                    (Number(inputValue) === 0 && Number(inputValue) === 0) ||
                    (inputValue === undefined && inputValue === undefined) ||
                    isPending
                  }
                >
                  {isPending ? t('Confirming') : t('Confirm')}
                </Button>
              ) : (
                <Button
                  mx="auto"
                  scale="sm"
                  onClick={handleApprove}
                  isLoading={isPending}
                  endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                >
                  {t('Approve')}
                </Button>
              )}
            </Flex>
          </Section>
        </Flex>
      </SectionWrapper>
    </Page>
  )
}

export default FarmSA
