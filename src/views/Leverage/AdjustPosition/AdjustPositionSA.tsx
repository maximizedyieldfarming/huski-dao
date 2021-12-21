/* eslint-disable no-restricted-properties */
import React, { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  Text,
  Skeleton,
  useTooltip,
  InfoIcon,
  ChevronRightIcon,
  AutoRenewIcon,
} from 'husky-uikit1.0'
import styled from 'styled-components'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount, formatNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import { useVault } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import {
  getHuskyRewards,
  getYieldFarming,
  getBorrowingInterest,
  getAdjustData,
  getAdjustPositionRepayDebt,
} from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'

interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #7b3fe4;
`
const MoveBox1 = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #83BF6E;
`
const makeLongShadow = (color: any, size: any) => {
  let i = 2
  let shadow = `${i}px 0 0 ${size} ${color}`

  for (; i < 856; i++) {
    shadow = `${shadow}, ${i}px 0 0 ${size} ${color}`
  }

  return shadow
}

const RangeInput = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 850px;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #b488ff, #3a009e) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle.png');
    background-position: center center;
    background-repeat: no-repeat;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('#E7E7E7', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const RangeInput1 = styled.input`
  overflow: hidden;
  display: block;
  appearance: none;
  max-width: 850px;
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #83BF6E, #83BF6E) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/RangeHandle1.png');
    background-position: center center;
    background-repeat: no-repeat;

    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('#E7E7E7', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

interface LocationParams {
  data: any
}

const Section = styled(Box)`
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  margin-left: auto;
  margin-right : auto;
  width : 95%;
  ${({ theme }) => theme.mediaQueries.lg} {
  width : 60%;
}
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1.5rem 0;
      
    }
  }
`
const BalanceInputWrapper = styled(Flex)`
  border-bottom: 2px solid #9DA2A6;
  padding: 5px;
  input {
    border: none;
    box-shadow: none;
    &:focus:not(:disabled) {
      box-shadow: none;
    }
  }
`

const AdjustPositionSA = () => {
  const { account } = useWeb3React()
  BigNumber.config({ EXPONENTIAL_AT: 1e9 }) // with this numbers from BigNumber won't be written in scientific notation (exponential)
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()
  const history = useHistory()
  console.log('daata', data)

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setTargetPositionLeverage(Number(value))
  }

  // const marketStrategy = 'bull' // TODO: get from data
  const [tokenInput, setTokenInput] = useState<string>()
  // const [quoteTokenInput, setQuoteTokenInput] = useState(0)

  const { positionId, debtValue, lpAmount, vault, positionValueBase } = data
  const {
    TokenInfo,
    QuoteTokenInfo,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    tradeFee,
    leverage,
    lptotalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
  } = data?.farmData
  const { quoteToken, token } = TokenInfo
  const { vaultAddress } = TokenInfo
  const quoteTokenVaultAddress = QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(TokenInfo.token.address))
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(TokenInfo.quoteToken.address))
  const lptotalSupplyNum = new BigNumber(lptotalSupply)

  const targetRef = React.useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)

  const targetRef1 = React.useRef<any>()
  const [moveVal1, setMoveVal1] = useState({ width: 0, height: 0 })
  const [margin1, setMargin1] = useState(0)

  let symbolName
  let lpSymbolName
  let tokenValue
  let quoteTokenValue
  let tokenPrice
  let quoteTokenPrice
  let tokenValueSymbol
  let quoteTokenValueSymbol
  let baseTokenAmount
  let farmTokenAmount
  let basetokenBegin
  let farmingtokenBegin
  let workerAddress
  let withdrawMinimizeTradingAddress
  let partialCloseLiquidateAddress
  let contract
  let tokenInputValue
  let quoteTokenInputValue
  let userTokenBalance
  let userQuoteTokenBalance
  let minimumDebt

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    // console.log('case 1')
    symbolName = token?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = TokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = token
    quoteTokenValue = quoteToken
    tokenPrice = tokenPriceUsd
    quoteTokenPrice = quoteTokenPriceUsd
    tokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    farmTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = TokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = vaultContract
    tokenInputValue = tokenInput || 0
    quoteTokenInputValue = 0 // formatNumber(quoteTokenInput)
    userTokenBalance = getBalanceAmount(tokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance)
    userQuoteTokenBalance = getBalanceAmount(
      quoteTokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance,
    )
    minimumDebt = new BigNumber(data.farmData?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  } else {
    //  console.log('case 2')
    symbolName = quoteToken?.symbol.replace('wBNB', 'BNB')
    lpSymbolName = QuoteTokenInfo?.name.replace(' PancakeswapWorker', '')
    tokenValue = quoteToken
    quoteTokenValue = token
    tokenPrice = quoteTokenPriceUsd
    quoteTokenPrice = tokenPriceUsd
    tokenValueSymbol = quoteToken?.symbol.replace('wBNB', 'BNB')
    quoteTokenValueSymbol = token?.symbol.replace('wBNB', 'BNB')
    baseTokenAmount = (Number(quoteTokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    farmTokenAmount = (Number(tokenAmountTotal) / Number(lptotalSupplyNum)) * lpAmount
    // baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    // farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyPartialCloseMinimizeTrading
    partialCloseLiquidateAddress = QuoteTokenInfo.strategies.StrategyPartialCloseLiquidate
    contract = quoteTokenVaultContract
    tokenInputValue = 0 // formatNumber(quoteTokenInput)
    quoteTokenInputValue = tokenInput || 0
    userTokenBalance = getBalanceAmount(
      tokenValueSymbol === 'BNB' ? bnbBalance : quoteTokenBalance,
    )
    userQuoteTokenBalance = getBalanceAmount(quoteTokenValueSymbol === 'BNB' ? bnbBalance : tokenBalance)
    minimumDebt = new BigNumber(data.farmData?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
  }
  // console.info('use this', {
  //   symbolName,
  //   lpSymbolName,
  //   tokenValue,
  //   quoteTokenValue,
  //   tokenPrice,
  //   quoteTokenPrice,
  //   tokenValueSymbol,
  //   quoteTokenValueSymbol,
  //   baseTokenAmount,
  //   farmTokenAmount,
  //   basetokenBegin,
  //   farmingtokenBegin,
  //   workerAddress,
  //   withdrawMinimizeTradingAddress,
  //   partialCloseLiquidateAddress,
  //   contract,
  //   tokenInputValue,
  //   quoteTokenInputValue,
  //   userTokenBalance,
  //   userQuoteTokenBalance,
  // })

  const totalPositionValueInToken = new BigNumber(positionValueBase).dividedBy(BIG_TEN.pow(18)) // positionValueBaseNumber
  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18))
  const debtRatio = new BigNumber(debtValueNumber).div(new BigNumber(totalPositionValueInToken))
  const lvgAdjust = new BigNumber(baseTokenAmount)
    .times(2)
    .div(new BigNumber(baseTokenAmount).times(2).minus(new BigNumber(debtValueNumber)))
  const currentPositionLeverage = Number(lvgAdjust.toFixed(2, 1)) // lvgAdjust.toNumber()
  const [targetPositionLeverage, setTargetPositionLeverage] = useState<number>(currentPositionLeverage)
  // for apr
  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()
  const yieldFarmData = getYieldFarming(data?.farmData, cakePrice)
  const huskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  // const { borrowingInterest } = getBorrowingInterest(data?.farmData, symbolName)
  const { borrowingInterest } = useFarmsWithToken(data?.farmData, symbolName)
  const yieldFarmAPR = yieldFarmData * Number(currentPositionLeverage)
  const tradingFeesAPR = Number(tradeFee) * 365 * Number(currentPositionLeverage)
  const huskiRewardsAPR = huskyRewards * (currentPositionLeverage - 1)
  const borrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const apr = Number(yieldFarmAPR) + Number(tradingFeesAPR) + Number(huskiRewardsAPR) - Number(borrowingInterestAPR)
  const apy = Math.pow(1 + apr / 100 / 365, 365) - 1

  const adjustedYieldFarmAPR = yieldFarmData * Number(targetPositionLeverage)
  const adjustedTradingFeesAPR = Number(tradeFee) * 365 * Number(targetPositionLeverage)
  const adjustedHuskyRewards = getHuskyRewards(data?.farmData, huskyPrice, symbolName) * 100
  const adjustHuskiRewardsAPR = adjustedHuskyRewards * (targetPositionLeverage - 1)
  const adjustBorrowingInterestAPR = borrowingInterest * (currentPositionLeverage - 1)
  const adjustedApr: number =
    Number(adjustedYieldFarmAPR) +
    Number(adjustedTradingFeesAPR) +
    Number(adjustHuskiRewardsAPR) -
    Number(adjustBorrowingInterestAPR)
  const adjustedApy = Math.pow(1 + adjustedApr / 100 / 365, 365) - 1;

  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [targetPositionLeverage])

  useEffect(() => {
    const tt = ((targetPositionLeverage - 1) / (leverage - 1)) * (moveVal.width - 26)

    setMargin(tt)

  }, [targetPositionLeverage, moveVal.width, leverage])


  const { farmingData, repayDebtData } = getAdjustData(data.farmData, data, targetPositionLeverage, tokenInput, 0, symbolName)
  const adjustData = farmingData ? farmingData[1] : []
  let assetsBorrowed
  let baseTokenInPosition
  let farmingTokenInPosition
  let closeRatioValue // the ratio of position to close

  let UpdatedDebt
  if (adjustData?.[3] === 0 && adjustData?.[11] === 0) {
    // use repayDebtData
    assetsBorrowed = repayDebtData?.[4]
    baseTokenInPosition = repayDebtData?.[2]
    farmingTokenInPosition = repayDebtData?.[3]
    UpdatedDebt = Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  } else {
    assetsBorrowed = adjustData?.[3]
    baseTokenInPosition = adjustData?.[8]
    farmingTokenInPosition = adjustData?.[9]
    UpdatedDebt = targetPositionLeverage >= currentPositionLeverage ? adjustData?.[3] + Number(debtValueNumber) : Number(debtValueNumber) - repayDebtData?.[4]
    closeRatioValue = repayDebtData?.[8]
  }


  const [percentageToClose, setPercentageToClose] = useState<number>(0)

  const { needCloseBase, needCloseFarm, remainBase, remainFarm, priceImpactClose, tradingFeesClose, remainLeverage, AmountToTrade, willReceive, minimumReceived, closeRatio, willReceivebase, willReceivefarm, minimumReceivedbase, minimumReceivedfarm } = getAdjustPositionRepayDebt(
    data.farmData,
    data,
    targetPositionLeverage,
    percentageToClose / 100,
    symbolName,
    true
  )



  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? input : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )
  useLayoutEffect(() => {
    if (targetRef1.current !== null && targetRef1.current !== undefined) {
      setMoveVal1({
        width: targetRef1?.current?.offsetWidth,
        height: targetRef1?.current?.offsetHeight,
      })
      console.log("!!!!", targetRef1?.current?.offsetWidth);
    }
  }, [percentageToClose])

  useEffect(() => {
    setMargin1((moveVal1.width - 32) / 100 * percentageToClose);
  }, [percentageToClose, moveVal1.width])

  const [isRepayDebt, setIsRepayDebt] = useState(false)

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={`${value.toFixed(2)}x`} style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />)
  })()

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isPending, setIsPending] = useState(false)
  const handleFarm = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }

    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your request was successfull'))
      history.push('/singleAssets')
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessful', 'Something went wrong your request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput('')
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const AssetsBorrowed = adjustData ? assetsBorrowed : debtValueNumber
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString().replace(/\.(.*?\d*)/g, '') // 815662939548462.2--- >  815662939548462
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let amount
    // let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker

    // base token is base token
    if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
      // single base token
      if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
        console.info('base + single + token input ')
        strategiesAddress = TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        // if (Number(tokenInputValue || 0) === 0 && Number(quoteTokenInputValue || 0) !== 0) {
        console.info('base + single + quote token input ---')
        farmingTokenAmount = quoteTokenInputValue || '0'
        strategiesAddress = TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      amount = getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
    } else {
      // farm token is base token
      if (Number(tokenInputValue) !== 0 && Number(quoteTokenInputValue) === 0) {
        console.info('farm + single + token input ')
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        // if (Number(tokenInputValue || 0) === 0 && Number(quoteTokenInputValue || 0) !== 0) {
        console.info('farm + single +1 quote token input ')
        farmingTokenAmount = quoteTokenInputValue || '0'
        strategiesAddress = QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      amount = getDecimalAmount(new BigNumber(tokenInputValue), 18).toString()
    }

    console.log({
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
      tokenInputValue,
      quoteTokenInputValue,
    })

    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  const handleFarmConvertTo = async (id, address, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    const callOptionsBNB = {
      gasLimit: 3800000,
      value: amount,
    }
    setIsPending(true)
    try {
      toastInfo(t('Pending Request...'), t('Please Wait!'))
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions,)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your request was successfull'))
      history.push('/singleAssets')
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirmConvertTo = async () => {
    let receive = 0;
    let closeRationum;
    if (Number(targetPositionLeverage) === 1) {
      receive = Number(minimumReceived)
      closeRationum = closeRatio
    } else {
      receive = 0
      closeRationum = closeRatioValue
    }
    const returnLpTokenValue = (lpAmount * closeRationum).toString()
    const id = positionId
    const amount = 0
    const loan = 0;
    const minbasetoken = Number(receive).toString()
    const minbasetokenvalue = getDecimalAmount(new BigNumber((minbasetoken)), 18).toString()
    const maxDebtRepay = Number(UpdatedDebt) > 0 ? Number(UpdatedDebt) : 0
    const maxDebtRepayment = Number(maxDebtRepay).toString()
    const abiCoder = ethers.utils.defaultAbiCoder;
    const maxReturn = ethers.utils.parseEther(maxDebtRepayment);
    const dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [returnLpTokenValue, ethers.utils.parseEther(maxDebtRepayment), ethers.utils.parseEther(minbasetokenvalue)]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [partialCloseLiquidateAddress, dataStrategy]);
    console.log({
      'handleConfirmConvertTo-symbolName': symbolName,
      returnLpTokenValue, receive, id, workerAddress,
      minbasetokenvalue, amount, loan, dataStrategy, maxDebtRepayment,
      partialCloseLiquidateAddress,
      minbasetoken, maxReturn, dataWorker,
      'ethers.utils.parseEther(maxDebtRepayment)': ethers.utils.parseEther(maxDebtRepayment),
      'ethers.utils.parseEther(minbasetokenvalue)': ethers.utils.parseEther(minbasetokenvalue)
    })
    handleFarmConvertTo(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }



  return (
    <Page>
      <Text fontWeight="bold" fontSize="3" mx="auto">
        {t('Adjust Position')}
      </Text>
      <Section>
        {/* <Text bold>{t('Current Position Leverage:')} {currentPositionLeverage.toPrecision(3)}x</Text> */}
        <Flex alignItems="center" justifyContent="space-between" style={{ border: 'none' }}>
          <Text>
            {t('Current Position Leverage:')} {currentPositionLeverage}x
          </Text>
          <CurrentPostionToken>
            <Text bold>{`${symbolName.replace('wBNB', 'BNB')}#${positionId}`}</Text>
            <Box width={24} height={24}>
              <TokenPairImage
                primaryToken={TokenInfo.token}
                secondaryToken={TokenInfo.quoteToken}
                width={24}
                height={24}
              />
            </Box>
            <Box>
              <Text style={{ whiteSpace: 'nowrap' }} bold>
                {lpSymbolName.replace(' PancakeswapWorker', '').toUpperCase().replace('WBNB', 'BNB')}
              </Text>
              <Text style={{ color: '#6F767E', fontSize: '12px' }}>{data.farmData.lpExchange}</Text>
            </Box>
          </CurrentPostionToken>
        </Flex>
        <Flex mt="-20px">
          <Text bold>{t('Target Position Leverage')}</Text>
          <PositionX ml="auto" color="#6F767E">
            <Text textAlign="right">{new BigNumber(targetPositionLeverage).toFixed(2, 1)}x</Text>
          </PositionX>
        </Flex>
        <Flex>
          <Box style={{ width: '100%', maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto' }}>
            <MoveBox move={margin}>
              <Text color="#7B3FE4" bold>
                {targetPositionLeverage}x
              </Text>
            </MoveBox>
            <Box ref={targetRef} style={{ width: '100%' }}>
              <RangeInput
                type="range"
                min="1.0"
                max={
                  new BigNumber(leverage).lt(currentPositionLeverage)
                    ? new BigNumber(currentPositionLeverage).toString()
                    : leverage
                }
                step="0.01"
                name="leverage"
                value={targetPositionLeverage}
                onChange={handleSliderChange}
                list="leverage"
                style={{ width: '100%' }}
              />
            </Box>
            <Flex justifyContent="space-between" mt="-22px" mb="10px">
              <div
                className="middle"
                style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
              />
              {targetPositionLeverage < 1.5 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              {targetPositionLeverage < 2 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              {targetPositionLeverage < 2.5 ? (
                <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }} />
              ) : (
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                />
              )}
              <div
                className="middle"
                style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#E7E7E7' }}
              />
            </Flex>
            <Text>
              <datalist
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
                id="leverage"
              >
                {datalistOptions}
              </datalist>
            </Text>
          </Box>
        </Flex>

        {/* default always show add collateral */}
        {targetPositionLeverage === currentPositionLeverage && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <Text bold>
                {t('You can customize your position with ')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                  bold
                  color="#7B3FE4"
                >
                  {t('Adding collateral')}
                </Text>
              </Text>
              <Box>
                <Flex mt="30px">
                  <Text>{t(`You're Repaying Debt`)}</Text>
                  <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                </Flex>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text bold>
                  {formatDisplayedBalance(debtValueNumber, tokenValue?.decimalsDigits)} {tokenValueSymbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center" style={{ fontWeight: 'bold' }}>
                    <Text>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon />
                    <Text>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {farmingTokenInPosition.toFixed(2)} {quoteTokenValueSymbol} + {baseTokenInPosition.toFixed(2)}{' '}
                    {tokenValueSymbol}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              {' '}
              <Text bold>
                {t('You can customize your position with partially')}{' '}
                <Text
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                  bold
                  color="#7B3FE4"
                >
                  {t('Repay Debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <Flex mt="30px">
                    <Text>{t(`You're adding collateral`)}</Text>
                    <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                  </Flex>
                  <Flex>
                    <Text fontSize="12px" color="#6F767E">
                      {t('Balance:')}
                    </Text>
                    <Text fontSize="12px" color="#6F767E">{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={tokenValue} width={24} height={24} />
                  </Box>
                  <NumberInput bold placeholder="0.00" value={tokenInput} onChange={handleTokenInput} style={{ background: "transparent" }} />
                  <Text mr="5px" small bold>
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text bold>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                    <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/*               <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}

        {/* if current >= max lvg, can only go left choose between add collateral or repay debt */}
        {targetPositionLeverage < currentPositionLeverage && targetPositionLeverage !== 1 ? (
          isRepayDebt ? (
            <>
              <Text bold>
                {t('You can customize your position with ')}{' '}
                <Text
                  color="#7B3FE4"
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                  bold
                >
                  {t('Adding collateral')}
                </Text>
              </Text>

              <Box>
                <Flex mt="30px">
                  <Text>{t(`You're repaying debt`)}</Text>
                  <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                </Flex>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text bold>
                  {formatDisplayedBalance(
                    new BigNumber(debtValueNumber).minus(UpdatedDebt).toNumber(),
                    tokenValue?.decimalsDigits,
                  )}{' '}
                  {tokenValueSymbol}
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text bold>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                    <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Text bold>
                {t('You can customize your position with partially')}{' '}
                <Text
                  color="#7B3FE4"
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                  bold
                >
                  {t('Repay Your Debt')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <Flex mt="30px">
                    <Text>{t(`You're adding collateral`)}</Text>
                    <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                  </Flex>
                  <Flex>
                    <Text fontSize="12px" color="#6F767E">
                      {t('Balance:')}
                    </Text>
                    <Text fontSize="12px" color="#6F767E">{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={tokenValue} width={40} height={40} />
                  </Box>
                  <NumberInput bold placeholder="0.00" value={tokenInput} onChange={handleTokenInput} style={{ background: "transparent" }} />
                  <Text mr="5px" small bold>
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text bold>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                    <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/* <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}

        {/* if target > current */}
        {targetPositionLeverage > currentPositionLeverage ? (
          <>
            <Box>
              <Flex mt="30px">
                <Text>{t(`You're borrowing more:`)}</Text>
                <InfoIcon mt="3px" ml="3px" color="#6F767E" />
              </Flex>

              <Text>
                {assetsBorrowed?.toFixed(2)} {symbolName}
              </Text>
            </Box>
            <Flex justifyContent="space-between">
              <Text>{t('APY')}</Text>
              {apy ? (
                <Flex alignItems="center">
                  <Text bold>{(apy * 100).toFixed(2)}%</Text>
                  <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                  <Text>{(adjustedApy * 100).toFixed(2)}%</Text>
                </Flex>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Position Value')}</Text>
              {adjustData ? (
                <Text bold>
                  {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                  {quoteTokenValueSymbol}
                </Text>
              ) : (
                <Text bold>
                  0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                </Text>
              )}
            </Flex>
            {/* <Flex justifyContent="space-between">
              <Text>{t('Minimum Debt Repayment')}</Text>
            </Flex> */}
          </>
        ) : null}

        {/* if target is 1 */}
        {targetPositionLeverage === 1 ? (
          isRepayDebt ? (
            <>
              <Text bold>
                {t('You can customize your position with')}{' '}
                <Text
                  color="#7B3FE4"
                  as="span"
                  onClick={(e) => setIsRepayDebt(false)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                  bold
                >
                  {t('Adding collateral')}
                </Text>
              </Text>
              <Box>
                <Flex mt="30px">
                  <Text>{t(`You're Repaying Debt`)}</Text>
                  <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                </Flex>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Debt')}</Text>
                <Text bold>
                  {formatDisplayedBalance(debtValueNumber, tokenValue?.decimalsDigits)} {tokenValueSymbol}
                </Text>
              </Flex>
              <Text>{t('What percentage would you like to close? (After repay all debt)')}</Text>
              <Flex mt="30px">
                <Box style={{ width: '100%', maxWidth: '850px', marginLeft: 'auto', marginRight: 'auto' }}>
                  <MoveBox1 move={margin1}>
                    <Text color="#83BF6E" bold>
                      {percentageToClose}%
                    </Text>
                  </MoveBox1>
                  <Box ref={targetRef1} style={{ width: '100%' }}>
                    <RangeInput1
                      type="range"
                      min="1.0"
                      max="100"
                      step="0.01"
                      name="leverage"
                      value={percentageToClose}
                      onChange={(e) => setPercentageToClose(Number(e.target.value))}
                      list="leverage"
                      style={{ width: '100%' }}
                    />
                  </Box>

                  <datalist
                    style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px' }}
                    id="leverage"
                  >
                    <option value={0} label='0%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                    <option value={25} label='25%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                    <option value={50} label='50%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                    <option value={75} label='75%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                    <option value={100} label='100%' style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
                  </datalist>
                </Box>
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text bold>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                    <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {remainFarm?.toFixed(3)} {quoteTokenValueSymbol} + {remainBase?.toFixed(3)} {tokenValueSymbol}
                    {/* {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol} */}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {quoteTokenValueSymbol} + 0.00 {tokenValueSymbol}
                  </Text>
                )}
              </Flex>
            </>
          ) : (
            <>
              <Text bold>
                {t('You can customize your position with ')}{' '}
                <Text
                  color="#7B3FE4"
                  bold
                  as="span"
                  onClick={(e) => setIsRepayDebt(true)}
                  style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '10px' }}
                >
                  {t('Partially Close Your Position')}
                </Text>
              </Text>
              <Box>
                <Flex justifyContent="space-between" mt="30px" alignItems="center">
                  <Flex>
                    <Text>{t(`You're adding collateral`)}</Text>
                    <InfoIcon mt="3px" ml="3px" color="#6F767E" />
                  </Flex>
                  <Flex>
                    <Text fontSize="12px" color="#6F767E">
                      {t('Balance:')}
                    </Text>
                    <Text fontSize="12px" color="#6F767E">{`${formatDisplayedBalance(
                      userTokenBalance,
                      tokenValue?.decimalsDigits,
                    )} ${tokenValueSymbol}`}</Text>
                  </Flex>
                </Flex>
                <BalanceInputWrapper alignItems="center" flex="1" padding="0" mt="16px">
                  <Box width={24} height={24} mr="5px">
                    <TokenImage token={tokenValue} width={24} height={24} />
                  </Box>
                  <NumberInput bold placeholder="0.00" value={tokenInput} onChange={handleTokenInput} style={{ background: "transparent" }} />
                  <Text mr="5px" small bold>
                    {tokenValueSymbol}
                  </Text>
                </BalanceInputWrapper>
              </Box>
              <Flex justifyContent="space-between">
                <Text>{t('APY')}</Text>
                {apy ? (
                  <Flex alignItems="center">
                    <Text bold>{(apy * 100).toFixed(2)}%</Text>
                    <ChevronRightIcon style={{ fontWeight: 'bold' }} />
                    <Text bold>{(adjustedApy * 100).toFixed(2)}%</Text>
                  </Flex>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex justifyContent="space-between">
                <Text>{t('Updated Position Value Assets')}</Text>
                {adjustData ? (
                  <Text bold>
                    {baseTokenInPosition.toFixed(2)} {tokenValueSymbol} + {farmingTokenInPosition.toFixed(2)}{' '}
                    {quoteTokenValueSymbol}
                  </Text>
                ) : (
                  <Text bold>
                    0.00 {tokenValueSymbol} + 0.00 {quoteTokenValueSymbol}
                  </Text>
                )}
              </Flex>
              {/* <Flex justifyContent="space-between">
                <Text>{t('Minimum Debt Repayment')}</Text>
              </Flex> */}
            </>
          )
        ) : null}
        <Text mx="auto" color="red" textAlign="center" mt="10px">
          {isRepayDebt
            ? new BigNumber(new BigNumber(debtValueNumber).minus(UpdatedDebt)).lt(minimumDebt)
              ? t('Minimum Debt Size: %minimumDebt% %name%', {
                minimumDebt: minimumDebt.toNumber(),
                name: tokenValueSymbol.toUpperCase().replace('WBNB', 'BNB'),
              })
              : null
            : null}
        </Text>
        <Flex>
          <Button
            style={{ width: '260px', height: '60px' }}
            onClick={isRepayDebt ? handleConfirmConvertTo : handleConfirm}
            disabled={
              !account ||
              (!isRepayDebt && !tokenInput) ||
              (isRepayDebt && targetPositionLeverage !== currentPositionLeverage) ||
              (isRepayDebt && targetPositionLeverage === 1 && currentPositionLeverage === 1 && percentageToClose !== 0) ||
              isPending
            }
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
            mx="auto"
          >
            {isPending ? t('Adjusting Position') : t('Adjust Position')}
          </Button>
        </Flex>
      </Section>
    </Page>
  )
}

export default AdjustPositionSA

const CurrentPostionToken = styled(Box)`
        border: 1px solid #EFEFEF;
        box-sizing: border-box;
        border-radius: 12px;
        width: 290px;
        height: 80px;
        display : flex;
        justify-content : space-between;
        align-items : center;
        padding : 0px 20px;
        `

const PositionX = styled(Box)`
        width: 78px;
        height: 40px;
        border: 1px solid #EFEFEF;
        box-sizing: border-box;
        border-radius: 10px;
        display : flex;
        justify-content : center;
        align-items : center;

        `