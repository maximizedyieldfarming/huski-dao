import React, { useState, useCallback, useRef } from 'react'
import { useParams, useLocation, useHistory } from 'react-router'
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
    BalanceInput, ButtonMenu as UiKitButtonMenu, ButtonMenuItem as UiKitButtonMenuItem
} from 'husky-uikit1.0'
import Select from 'components/Select/Select'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { usePriceList, useTokenPriceList, useCakePrice, useHuskiPrice } from 'hooks/api'
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
import HighchartsReact from 'highcharts-react-official';
import useTheme from 'hooks/useTheme'
import { useWeb3React } from '@web3-react/core'
import SingleFarmSelect from 'components/Select/SingleFarmSelect'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import {
    getHuskyRewards,
    getYieldFarming,
    getLeverageFarmingData,
    getBorrowingInterest,
    getRunLogic,
    getRunLogic1,
} from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'

interface LocationParams {
    singleData?: any
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
    padding: 1.5rem 2rem;
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
  > ${Flex} {
    flex-direction: column;
    gap: 1rem;
    &.infoSide {
      > ${Box} {
       // height:;
      }
    }
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

  border-radius: 12px;
  border: unset;
  width: 100%;
`

const ButtonMenuItem = styled(UiKitButtonMenuItem)`
  color: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : theme.colors.text)};
  box-shadow: 0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25);
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
  border-radius: 12px;
  padding: 5px;
  height : 60px;
  background : #F7F7F8;
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
        state: { singleData: data, marketStrategy: selectedStrategy },
    } = useLocation<LocationParams>()
    const history = useHistory()

    const singleFarm = data
    const coingeckoId = singleFarm?.TokenInfo?.token?.coingeckoId
    const { isDark, toggleTheme } = useTheme()
    const priceList = usePriceList(coingeckoId)

    const getSingleLeverage = (selStrategy: string): number => {
        if (selStrategy.toLowerCase() === 'bull3x' || selStrategy.toLowerCase() === 'bear') {
            return 3
        }
        return 2
    }
    const tokenPriceList = useTokenPriceList(coingeckoId)
    const [marketStrategy, setMarketStrategy] = useState<string>(selectedStrategy)
    const singleLeverage: number = getSingleLeverage(marketStrategy)

    let tokenName
    let quoteTokenName
    let riskKillThreshold

    const getDefaultTokenInfo = (selStrat: string): string => {
        if (selStrat.includes('bull')) {
            return 'QuoteTokenInfo'
        }
        return 'TokenInfo'
    }
    const tokenInfoToUse = getDefaultTokenInfo(marketStrategy)


    const [selectedToken, setSelectedToken] = useState(singleFarm?.[tokenInfoToUse]?.token)

    if (marketStrategy.includes('bull')) { // bull === 2x long
        tokenName = singleFarm?.QuoteTokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
        quoteTokenName = singleFarm?.QuoteTokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
        riskKillThreshold = singleFarm?.quoteTokenLiquidationThreshold
    } else { // 2x short || 3x short
        tokenName = singleFarm?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
        quoteTokenName = singleFarm?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
        riskKillThreshold = singleFarm?.liquidationThreshold
    }

    // for chart logic params
    const Token0Name = singleFarm?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    const Token1Name = singleFarm?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')

    const allowance = singleFarm?.userData?.quoteTokenAllowance

    const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
    const isApproved: boolean = Number(allowance) > 0
    const [isPending, setIsPending] = useState(false)

    const { balance: bnbBalance } = useGetBnbBalance()
    const { balance: tokenBalance } = useTokenBalance(getAddress(selectedToken?.address))
    const userTokenBalance = getBalanceAmount(selectedToken.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance)

    const [inputValue, setInputValue] = useState<string>()
    const [buttonIndex, setButtonIndex] = useState(null)
    const handleInput = useCallback((event) => {
        // check if input is a number and includes decimals
        if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
            const input = event.target.value
            // const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
            const finalValue = input
            setInputValue(finalValue)
        } else {
            event.preventDefault()
        }
        setButtonIndex(null)
    }, [])
    const setInputToFraction = (index) => {
        if (index === 0) {
            setInputValue(userTokenBalance.times(0.25).toString())
            setButtonIndex(index)
        } else if (index === 1) {
            setInputValue(userTokenBalance.times(0.5).toString())
            setButtonIndex(index)
        } else if (index === 2) {
            setInputValue(userTokenBalance.times(0.75).toString())
            setButtonIndex(index)
        } else if (index === 3) {
            setInputValue(userTokenBalance.toString())
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
        if (marketStrategy.includes('bull')) {
            contract = approveContract
        } else {
            contract = quoteTokenApproveContract //  approveContract
        }

        setIsApproving(true)
        try {
            toastInfo(t('Approving...'), t('Please Wait!'))
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
    const { borrowingInterest } = useFarmsWithToken(singleFarm, tokenName)

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

    if (marketStrategy.includes('bull')) { // bull === 2x long
        if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName) {
            tokenInputValue = inputValue || 0;
            quoteTokenInputValue = 0
        } else {
            tokenInputValue = 0
            quoteTokenInputValue = inputValue || 0;
        }
    } else {
        // eslint-disable-next-line no-lonely-if
        if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') !== tokenName) {
            tokenInputValue = 0
            quoteTokenInputValue = inputValue || 0;
        } else {
            tokenInputValue = inputValue || 0;
            quoteTokenInputValue = 0
        }
    }

    const farmingData = getLeverageFarmingData(singleFarm, singleLeverage, tokenInputValue, quoteTokenInputValue, tokenName)
    const farmData = farmingData ? farmingData[1] : []
    // console.log('values for farmData', {singleFarm, singleLeverage, tokenInputValue, quoteTokenInputValue, tokenName, farmData})
    // console.log('farmData', farmData)
    const apy = getApy(singleLeverage)

    // const selectOptions = []
    // data.farmData?.forEach((item, index) => {
    //     selectOptions.push({
    //         label: item.lpSymbol.replace(' LP', ''),
    //         value: index,
    //     })
    // })

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


    const bnbVaultAddress = getWbnbAddress() // "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    const depositContract = useVault(bnbVaultAddress)
    const handleDeposit = async (bnbMsgValue) => {

        const callOptionsBNB = {
            gasLimit: 380000,
            value: bnbMsgValue,
        }
        // setIsPending(true)
        try {
            toastInfo(t('Transaction Pending...'), t('Please Wait!'))
            const tx = await callWithGasPrice(
                depositContract,
                'deposit',
                [bnbMsgValue],
                callOptionsBNB,
            )
            const receipt = await tx.wait()
            if (receipt.status) {
                toastSuccess(t('Successful!'), t('Your deposit was successfull'))
            }
        } catch (error) {
            toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
        } finally {
            // setIsPending(false)
        }
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
            toastInfo(t('Pending Request!'), t('Please Wait'))
            const tx = await callWithGasPrice(
                contract,
                'work',
                [id, workerAddress, amount, loan, maxReturn, dataWorker],
                tokenName === 'BNB' ? callOptionsBNB : callOptions,
            )
            const receipt = await tx.wait()
            if (receipt.status) {
                toastSuccess(t('Successful!'), t('Your farm was successfull'))
                history.push('/singleAssets')
            }
        } catch (error) {

            toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
        } finally {
            setIsPending(false)
            setInputValue('')
            setButtonIndex(null)
        }
    }

    const handleConfirm = async () => {
        const id = 0
        const abiCoder = ethers.utils.defaultAbiCoder
        const AssetsBorrowed = farmData ? farmData[3] : 0
        const minLPAmountValue = farmData ? farmData[12] : 0
        const minLPAmount = minLPAmountValue.toString()
        const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString().replace(/\.(.*?\d*)/g, '')
        // getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()
        const maxReturn = 0

        let farmingTokenAmount
        let strategiesAddress
        let dataStrategy
        let dataWorker
        let contract
        let amount
        let workerAddress

        if (marketStrategy.includes('bull')) { // bull === 2x long
            console.info('1111bull')
            if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {  // token is farm token
                tokenInputValue = inputValue || 0
                quoteTokenInputValue = 0
                strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
                dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
                dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
            } else {
                console.info('!== tokenName')
                tokenInputValue = 0
                quoteTokenInputValue = inputValue || 0
                farmingTokenAmount = (quoteTokenInputValue)?.toString()
                strategiesAddress = singleFarm?.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
                dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
                dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
            }

            contract = quoteTokenVaultContract
            amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
            // getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
            workerAddress = singleFarm?.QuoteTokenInfo.address

        } else { // 2x short || 3x short
            console.info('2x short || 3x short', selectedToken.symbol)
            if (selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === tokenName) {
                console.info('===tokenname', tokenName)
                tokenInputValue = inputValue || 0
                quoteTokenInputValue = 0;
                strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddAllBaseToken
                dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
                dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
            } else {
                console.info('!!!==tokenname', tokenName)
                tokenInputValue = 0;
                quoteTokenInputValue = inputValue || 0
                farmingTokenAmount = (quoteTokenInputValue)?.toString()
                strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddTwoSidesOptimal
                dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1'])
                dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
            }
            contract = vaultContract
            amount = getDecimalAmount(new BigNumber(tokenInputValue || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
            // getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
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


        if (singleFarm?.lpSymbol.toUpperCase().includes('BNB') && marketStrategy.includes('bull') && selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB') === 'BNB') {
            const bnbMsgValue = getDecimalAmount(new BigNumber(farmingTokenAmount || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
            // getDecimalAmount(new BigNumber(farmingTokenAmount), 18).toString()
            handleDeposit(bnbMsgValue)
        }

        handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
    }



    const { priceRiseFall, profitLossRatioSheet1Token0, profitLossRatioSheet1Token1 } = getRunLogic(riskKillThreshold, getApr(1), singleLeverage, Token0Name, Token1Name, tokenName)
    const { dateList, profitLossRatioToken0, profitLossRatioToken1 } = getRunLogic1(priceList, riskKillThreshold, borrowingInterest, getApr(1), singleLeverage, Token0Name, Token1Name, tokenName)

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

    const getOption1 = () => {

        const option = {

            rangeSelector: {

                buttons: [{
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }, {
                    type: 'ytd',
                    text: 'YTD'
                }, {
                    type: 'year',
                    count: 1,
                    text: '1y'
                }, {
                    type: 'all',
                    text: 'All'
                }],
                selected: 4  // 默认选中的范围，值为上面 buttons 数组的下标（从 0 开始）
            },
            chart: {
                backgroundColor: isDark ? "#111315" : "white",
                polar: true,
                type: 'line',
                color: "white"
            },
            plotOptions: {
                series: {
                    showInLegend: true
                }
            },
            tooltip: {
                split: false,
                shared: true
            },
            series: [{
                // type: 'line',
                id: '000001',
                name: '平安银行',
                data: tokenPriceList
            }]

        };

        return option
    }

    const getSelectOptions = (): Array<{ icon: string, value: string, label: string }> => {
        if (selectedStrategy === 'neutral') {
            return [
                {
                    icon: 'neutral',
                    value: 'neutral',
                    label: 'Neutral strategy 2x',
                },
                {
                    icon: 'bear',
                    value: 'bear',
                    label: 'Bear strategy 3x',
                },
                {
                    icon: 'bull',
                    value: 'bull2x',
                    label: 'Bull Strategy 2x',
                },
                {
                    icon: 'bull',
                    value: 'bull3x',
                    label: 'Bull Strategy 3x',
                },
            ]
        }
        if (selectedStrategy === 'bear') {
            return [
                {
                    icon: 'bear',
                    value: 'bear',
                    label: 'Bear strategy 3x',
                },
                {
                    icon: 'bull',
                    value: 'bull2x',
                    label: 'Bull Strategy 2x',
                },
                {
                    icon: 'bull',
                    value: 'bull3x',
                    label: 'Bull Strategy 3x',
                },
                {
                    icon: 'neutral',
                    value: 'neutral',
                    label: 'Neutral strategy 2x',
                },
            ]
        }
        if (selectedStrategy === 'bull2x') {
            return [
                {
                    icon: 'bull',
                    value: 'bull2x',
                    label: 'Bull Strategy 2x',
                },
                {
                    icon: 'bull',
                    value: 'bull3x',
                    label: 'Bull Strategy 3x',
                },
                {
                    icon: 'bear',
                    value: 'bear',
                    label: 'Bear strategy 3x',
                },
                {
                    icon: 'neutral',
                    value: 'neutral',
                    label: 'Neutral strategy 2x',
                },
            ]
        }
        return [
            {
                icon: 'bull',
                value: 'bull3x',
                label: 'Bull Strategy 3x',
            },
            {
                icon: 'bull',
                value: 'bull2x',
                label: 'Bull Strategy 2x',
            },
            {
                icon: 'bear',
                value: 'bear',
                label: 'Bear strategy 3x',
            },
            {
                icon: 'neutral',
                value: 'neutral',
                label: 'Neutral strategy 2x',
            },
        ]
    }

    const getTokenSelectOptions = React.useCallback(() => {
        return [
            {
                icon: singleFarm?.[tokenInfoToUse]?.token,
                label: singleFarm?.[tokenInfoToUse]?.token?.symbol.toUpperCase().replace('WBNB', 'BNB'),
                value: singleFarm?.[tokenInfoToUse]?.token,
            },
            {
                icon: singleFarm?.[tokenInfoToUse]?.quoteToken,
                label: singleFarm?.[tokenInfoToUse]?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB'),
                value: singleFarm?.[tokenInfoToUse]?.quoteToken,
            },

        ]
    }, [singleFarm, tokenInfoToUse])


    const [tokenSelectOptions, setTokenSelectOptions] = useState(getTokenSelectOptions())
    const [resetWatcher, setResetWatcher] = useState(0)
    React.useEffect(() => {
        setSelectedToken(singleFarm?.[tokenInfoToUse]?.token,)
        setTokenSelectOptions(getTokenSelectOptions());
        setResetWatcher(prev => prev + 1)
    }, [getTokenSelectOptions, marketStrategy, singleFarm, tokenInfoToUse])

    const yieldFarming = Number(yieldFarmData * singleLeverage)
    const tradingFees = Number((singleFarm?.tradeFee * 365) * singleLeverage)
    const huskyRewardsData = Number(huskyRewards * (singleLeverage - 1)) * 100
    const borrowingInterestData = Number(borrowingInterest * (singleLeverage - 1)) * 100
    const apr = getApr(singleLeverage) * 100
    const dailyApr = apr / 365

    const minimumDebt = tokenName === singleFarm?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB') ? new BigNumber(singleFarm?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18)) : new BigNumber(singleFarm?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))

    const { tooltip, targetRef, tooltipVisible } = useTooltip(
        <>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Yield Farming')}</Text>
                <Text>{yieldFarming?.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Trading Fees')}</Text>
                <Text>{tradingFees.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Huski Rewards')}</Text>
                <Text>{huskyRewardsData.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Borrowing Interest')}</Text>
                <Text>-{Number(borrowingInterestData).toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Total APR')}</Text>
                <Text>{apr.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Total APY')}</Text>
                <Text>{apy.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
                <Text small>{t('Daily APR')}</Text>
                <Text>{dailyApr.toFixed(2)}%</Text>
            </Flex>
        </>,
        { placement: 'right' },
    )

    const [chartype, setChartType] = useState(0);
    return (
        <Page>
            <Text bold fontSize="3" color="secondary" mx="auto">
                {t(
                    `Farming ${singleFarm.QuoteTokenInfo.name.toUpperCase().replace('WBNB', 'BNB')
                        .replace(' PANCAKESWAPWORKER', '')} Pools`,
                )}
            </Text>
            <SectionWrapper>
                <Flex className="graphSide" flex="2" >
                    <Section style={{ height: "500px" }}>
                        <HighchartsReact highcharts={Highcharts} options={getOption1()} constructorType='stockChart' style={{ height: '500px' }} />
                    </Section>

                    <Section>
                        <Flex justifyContent="space-between" style={{flexFlow: "row wrap"}}>
                            <Flex>
                                <Text style={{ marginRight: "40px", cursor: "pointer", color: chartype === 0 ? "#623CE7" : "", fontWeight: "bold", borderBottom: chartype === 0 ? "3px solid #623CE7" : "", paddingBottom: "10px" }} onClick={() => setChartType(0)}>{t(`Time Profit`)}</Text>
                                <Text style={{ cursor: "pointer", color: chartype === 1 ? "#623CE7" : "", fontWeight: "bold", borderBottom: chartype === 1 ? "3px solid #623CE7" : "", paddingBottom: "10px" }} onClick={() => setChartType(1)}>{t(`Price Profit`)}</Text>
                            </Flex>
                            <Flex>
                                <Box background="#FF6A55" height="7px" width="30px" marginTop="7px" marginRight=" 5px"> </Box>
                                <Text>{t('USD Value')}</Text>
                            </Flex>
                            <Flex>
                                <Box background="#7B3FE4" height="7px" width="30px" marginTop="7px" marginRight=" 5px"> </Box>
                                <Text>{t('Coin Value')}</Text>
                            </Flex>
                            <Text style={{ border: "0.5px #C3C1C1 solid", height: "30px", padding: "0px 20px", borderRadius: "12px" }}>APY : &nbsp;&nbsp;{apy.toFixed(2)}%</Text>
                        </Flex>
                        {chartype === 0 ? <ReactEcharts option={getOption()} style={{ height: '500px' }} /> :
                            <ReactEcharts option={getOption2()} style={{ height: '500px' }} />}
                    </Section>
                </Flex>
                <Flex className="infoSide" flex="1">
                    <Section>
                        <Box>
                            <Flex>
                                <SingleFarmSelect
                                    options={getSelectOptions()}
                                    onChange={(option) => {
                                        setMarketStrategy(option.value)
                                        setInputValue('')
                                        setButtonIndex(null)
                                    }}
                                    width="calc(80%)"
                                />
                            </Flex>
                            <Flex justifyContent="space-between" alignItems="center" paddingTop="20px">
                                <Text>{t('Collateral')}</Text>
                                <SingleFarmSelect
                                    options={tokenSelectOptions}
                                    onChange={(option) => {
                                        setSelectedToken(option.value)
                                        setInputValue('')
                                        setButtonIndex(null)
                                    }}
                                    width="140px"
                                    reset={resetWatcher}
                                />
                            </Flex>
                            <Box>
                                <Flex>
                                    <Text mr="5px" small color="textSubtle">
                                        {t('Balance:')}
                                    </Text>
                                    <Text small color="textSubtle">
                                        {balanceNumber}
                                    </Text>
                                </Flex>
                                <InputArea justifyContent="space-between" mt="10px" mb="1rem" style={{ background: isDark ? "#111315" : "#F7F7F8" }}>
                                    <BalanceInputWrapper alignItems="center" flex="1" style={{ background: isDark ? "#111315" : "#F7F7F8" }}>
                                        <Box width={50} height={50} ml="5px" mt="15px">
                                            <TokenImage token={selectedToken} width={50} height={50} />
                                        </Box>
                                        <NumberInput fontSize="16px" fontWeight="bold" placeholder="0.00" value={inputValue} onChange={handleInput} style={{ background: "unset" }} />

                                        <Text fontSize="16px" fontWeight="bold" mr="5px">
                                            {selectedToken.symbol.toUpperCase().replace('WBNB', 'BNB')}
                                        </Text>
                                    </BalanceInputWrapper>
                                </InputArea>
                                <Box width="90%" overflow="auto">
                                <ButtonMenu
                                    onItemClick={setInputToFraction}
                                    activeIndex={buttonIndex}
                                    disabled={userTokenBalance.eq(0)}
                                    >
                                    <ButtonMenuItem>25%</ButtonMenuItem>
                                    <ButtonMenuItem>50%</ButtonMenuItem>
                                    <ButtonMenuItem>75%</ButtonMenuItem>
                                    <ButtonMenuItem>100%</ButtonMenuItem>
                                </ButtonMenu>
                                    </Box>
                            </Box>
                        </Box>
                        <Text fontSize="12px" color="#6F767E" mt="10px">Ethereum is a global, open-source platform for decentralized applications. </Text>
                        <Flex alignItems="center" justifyContent="space-between">
                            <Flex>
                                <Text  >{t('APY')}</Text>
                                {tooltipVisible && tooltip}
                                <span ref={targetRef}>
                                    <InfoIcon ml="10px" width="25px" height="25px" />
                                </span>
                            </Flex>
                            <Text fontWeight="bold">{apy.toFixed(2)}%</Text>
                        </Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                            <Text small>{t('Equity')}</Text>
                            {farmData ? (
                                <Text fontWeight="bold">
                                    {new BigNumber(farmData[3])?.toFixed(3, 1)} {tokenName}
                                </Text>
                            ) : (
                                <Text fontWeight="bold">0.00 {tokenName}</Text>
                            )}
                        </Flex>
                        <Flex alignItems="center" justifyContent="space-between">
                            <Text small>{t('Position Value')}</Text>
                            {farmData ? (
                                <Text fontWeight="bold">
                                    {new BigNumber(farmData[8]).toFixed(3, 1)} {tokenName} + {new BigNumber(farmData[9]).toFixed(3, 1)} {quoteTokenName}
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
                                        Number(inputValue) === 0 ||
                                        inputValue === undefined ||
                                        isPending
                                    }
                                >
                                    {isPending ? t('Confirming') : t('Confirm')}
                                </Button>
                            ) : (
                                <Button
                                    mx="auto"
                                    scale="md"
                                    width="70%"
                                    onClick={handleApprove}
                                    isLoading={isPending}
                                    endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                                >
                                    {isPending ? t('Approving') : t('Approve')}
                                </Button>
                            )}
                        </Flex>
                        <Flex>
                            {inputValue ? <Text mx="auto" color='red'>{new BigNumber(farmData[3]).lt(minimumDebt) ? t('Minimum Debt Size: %minimumDebt% %tokenName%', { minimumDebt: minimumDebt.toNumber(), tokenName: tokenName.toUpperCase().replace('WBNB', 'BNB') }) : null}</Text> : null}
                        </Flex>
                    </Section>
                </Flex>
            </SectionWrapper >
        </Page >
    )
}

export default FarmSA

// NOTE: javascript Number function and BigNumber.js toNumber() function might return a different value than the actual value
// if that value is bigger than MAX_SAFE_INTEGER. so needs to be careful when doing number operations.
// https://stackoverflow.com/questions/35727608/why-does-number-return-wrong-values-with-very-large-integers