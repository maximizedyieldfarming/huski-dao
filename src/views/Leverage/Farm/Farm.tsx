import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react'
import { useParams, useLocation, useHistory } from 'react-router'
import Page from 'components/Layout/Page'
import {
  Box,
  Button,
  Flex,
  InfoIcon,
  Text,
  Skeleton,
  useTooltip,
  ArrowForwardIcon,
  useMatchBreakpoints,
  AutoRenewIcon,
} from 'husky-uikit1.0'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useCakePrice, useHuskiPrice } from 'hooks/api'
import useTokenBalance, { useGetBnbBalance, useTokenAllowance } from 'hooks/useTokenBalance'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import Select from 'components/Select/Select'
import { ethers } from 'ethers'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import DebtRatioProgress from 'components/DebRatioProgress'
import { useWeb3React } from '@web3-react/core'
import { BIG_TEN } from 'utils/bigNumber'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData } from '../helpers'
import { useFarmsWithToken } from '../hooks/useFarmsWithToken'
import { useTradingFees } from '../hooks/useTradingFees'

interface RouteParams {
  token: string
}

interface LocationParams {
  tokenData?: any
  selectedLeverage: number
  selectedBorrowing?: string
}

const Section = styled(Box)`
  &.gray {
    background-color: ${({ theme }) => theme.colors.input};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;

  > ${Flex} {
    padding: 1.2rem 0;
   
  }

  input[type='range'] {
    -webkit-appearance: none;
  }
`
const SectionWrapper = styled(Page)`
  display: flex;
  justify-content : center;
  min-height : unset;
  flex-direction: column;
  padding-bottom : 0;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  > .main {
   ${({ theme }) => theme.mediaQueries.lg} {
    width: 850px;
  }
}
  > .sideSection {
    flex-direction: column;
    gap: 1rem;
   ${({ theme }) => theme.mediaQueries.lg} {
    width: 500px;
  }
}
`

const InputArea = styled(Flex) <{ isDark: boolean }>`
  background-color: ${({ isDark }) => isDark ? '#111315' : '#F7F7F8'};
  border-radius: '12px';
  height: 80px;
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`
const customBotton = styled(Button)`
  background: transparent;
  border: none;
  color: #6f767e !important;
  width: 25%;
  margin-top: 4px;
  margin-bottom: 4px;
`
const StyledButton = styled(customBotton) <{ isDark: boolean }>`
  &:focus {
    width: 25%;
    border-color: transparent !important;
    background: ${({ isDark }) => isDark ? '#272B30' : 'white'};
    margin-top: 4px;
    margin-bottom: 4px;
    border-radius: 12px;
    color: #ff6a55 !important;
    box-shadow: ${({ isDark }) => isDark ? '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.06)' : '0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 0px rgba(255, 255, 255, 0.25)'};
  }
  &:visited {
    width: 25%;
    border-color: transparent !important;
    background: white;
    margin-top: 4px;
    margin-bottom: 4px;
    border-radius: 12px;
    color: #ff6a55 !important;
    box-shadow: 0px 4px 8px -4px rgba(0, 0, 0, 0.25), inset 0px -1px 1px rgba(0, 0, 0, 0.04),
      inset 0px 2px 0px rgba(255, 255, 255, 0.25);
  }
`
interface MoveProps {
  move: number
}

const MoveBox = styled(Box) <MoveProps>`
  margin-left: ${({ move }) => move}px;
  margin-top: -20px;
  margin-bottom: 10px;
  color: #7b3fe4;
`
const ButtonArea = styled(Flex) <{ isDark: boolean }>`
  background-color: ${({ isDark }) => isDark ? '#111315' : '#F7F7F8'};
  border-radius: 12px;
  padding-left: 4px;
  padding-right: 4px;
`
const StyledNumberInput = styled(NumberInput)`
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: 16px;
  font-weight: 700;
  &:focus {
    box-shadow: none !important;
  }
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
  width: 100%;
  margin: 0;
  height: 32px;

  cursor: pointer;

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 32px;
    background: linear-gradient(to right, #7B3FE4, #7B3FE4) 100% 50% / 100% 4px no-repeat transparent;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-thumb {
    position: relative;
    appearance: none !important;
    height: 32px;
    width: 28px;

    background-image: url('/images/blueslider.png');
    background-position: center center;
    background-repeat: no-repeat;
    background-size : 100% 100%;
    border: 0;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${makeLongShadow('rgb(189,159,242)', '-13px')};
    transition: background-color 150ms;
    &::before {
      height: 32px;
      width: 32px;
      background: red !important;
    }
  }
`

const SBPage = styled(Page)`
  overflow-x : hidden;
  min-height : unset;
  padding-top : 0px;
  padding-bottom : 20px;
  @media screen and (max-width : 450px){
    padding : 0;
    margin : 0;
  }
`;
const Farm = () => {
  BigNumber.config({ EXPONENTIAL_AT: 1e9 }) // with this numbers from BigNumber won't be written in scientific notation (exponential)
  const { token } = useParams<RouteParams>()
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const {
    state: { tokenData: data, selectedLeverage, selectedBorrowing },
  } = useLocation<LocationParams>()
  const history = useHistory()

  const tokenData = data
  const quoteTokenName = tokenData?.TokenInfo?.quoteToken?.symbol
  const tokenName = tokenData?.TokenInfo?.token?.symbol

  const [radio, setRadio] = useState(selectedBorrowing)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(selectedLeverage)
  const [testvalues, setTestValues] = useState([50])

  const { isDark } = useTheme()
  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setLeverageValue(value)
  }

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(`${(1 + 0.5 * (-1 + i)).toFixed(2)}x`)
    }
    return datalistSteps.map((value, i) => {
      if (i === datalistSteps.length - 1)
        return <option value={value} label="MAX" style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />

      return <option value={value} label={value} style={{ color: "#6F767E", fontWeight: "bold", fontSize: "13px" }} />
    })
  })()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const userTokenBalance = getBalanceAmount(
    tokenData?.TokenInfo?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    tokenData?.TokenInfo?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const huskyPrice = useHuskiPrice()
  const cakePrice = useCakePrice()

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, radio)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [tokenInput, setTokenInput] = useState<string>()
  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )

  const [quoteTokenInput, setQuoteTokenInput] = useState<string>()
  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userQuoteTokenBalance) ? userQuoteTokenBalance.toString() : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userQuoteTokenBalance],
  )

  // const handleChange = (e) => {
  //   const { value } = e.target
  //   setRadio(value)
  // }

  const setQuoteTokenInputToFraction = (e: any) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toString())
    }
  }

  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.times(0.25).toString())
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.times(0.5).toString())
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.times(0.75).toString())
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toString())
    }
  }

  const options = () => {
    if (
      tokenData?.TokenInfo.quoteToken.symbol.toUpperCase() === 'CAKE' ||
      tokenData?.TokenInfo.quoteToken.symbol.toUpperCase() === 'USDC' ||
      tokenData?.TokenInfo.quoteToken.symbol.toUpperCase() === 'SUSHI' ||
      tokenData?.TokenInfo.quoteToken.symbol.toUpperCase() === 'DOT'
    ) {
      return [
        {
          label: tokenData?.TokenInfo.token.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value: tokenData?.TokenInfo.token.symbol,
          icon: <Box width={20} height={20}><TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} /></Box>,
        },
        {
          label: tokenData?.TokenInfo.token.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value: tokenData?.TokenInfo.token.symbol,
          icon: <Box width={20} height={20}><TokenImage token={tokenData?.TokenInfo.token} width={20} height={20} /></Box>,
        },
      ]
    }
    if (
      tokenData?.TokenInfo.token.symbol.toUpperCase() === 'CAKE' ||
      tokenData?.TokenInfo.token.symbol.toUpperCase() === 'USDC' ||
      tokenData?.TokenInfo.token.symbol.toUpperCase() === 'SUSHI' ||
      tokenData?.TokenInfo.token.symbol.toUpperCase() === 'DOT'
    ) {
      return [
        {
          label: tokenData?.TokenInfo.quoteToken.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value: tokenData?.TokenInfo.quoteToken.symbol,
          icon: <Box width={20} height={20}><TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} /></Box>,
        },
        {
          label: tokenData?.TokenInfo.quoteToken.symbol.toUpperCase().replace('WBNB', 'BNB'),
          value: tokenData?.TokenInfo.quoteToken.symbol,
          icon: <Box width={20} height={20}><TokenImage token={tokenData?.TokenInfo.quoteToken} width={20} height={20} /></Box>,
        },
      ]
    }
    return [
      {
        label:
          selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
            ? tokenData?.TokenInfo.token.symbol.toUpperCase().replace('WBNB', 'BNB')
            : tokenData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB'),
        value:
          selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
            ? tokenData?.TokenInfo.token.symbol
            : tokenData?.TokenInfo?.quoteToken?.symbol,
        icon: (
          <Box width={20}
            height={20}>
            <TokenImage
              token={
                selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
                  ? tokenData?.TokenInfo.token
                  : tokenData?.TokenInfo?.quoteToken
              }
              width={20}
              height={20}
            />
          </Box>
        ),
      },
      {
        label:
          selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
            ? tokenData?.TokenInfo.quoteToken.symbol
            : tokenData?.TokenInfo?.token?.symbol,
        value:
          selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
            ? tokenData?.TokenInfo.quoteToken.symbol.toUpperCase().replace('WBNB', 'BNB')
            : tokenData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB'),
        icon: (
          <Box width={20}
            height={20}>
            <TokenImage
              token={
                selectedBorrowing === tokenData?.TokenInfo?.token?.symbol
                  ? tokenData?.TokenInfo.quoteToken
                  : tokenData?.TokenInfo?.token
              }
              width={20}
              height={20}
            />
          </Box>
        ),
      },
    ]
  }

  const farmingData = getLeverageFarmingData(tokenData, leverageValue, tokenInput, quoteTokenInput, radio)
  const farmData = farmingData ? farmingData[1] : []
  const { borrowingInterest } = useFarmsWithToken(tokenData, radio)
  const { tradingFees: tradeFee } = useTradingFees(tokenData)

  const getApr = (lvg) => {
    const totalapr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((tradeFee * 365) / 100) * lvg) +
      Number(huskyRewards * (lvg - 1)) -
      Number(borrowingInterest * (lvg - 1))
    return totalapr
  }
  const getApy = (lvg) => {
    const totalapr = getApr(lvg)
    // eslint-disable-next-line no-restricted-properties
    const totalapy = Math.pow(1 + totalapr / 365, 365) - 1
    return totalapy * 100
  }
  const totalAprDisplay = Number(getDisplayApr(getApr(leverageValue) * 100))

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const { vaultAddress } = tokenData.TokenInfo
  const quoteTokenVaultAddress = tokenData.QuoteTokenInfo.vaultAddress
  const vaultContract = useVault(vaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isPending, setIsPending] = useState(false)

  const bnbVaultAddress = getWbnbAddress()
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

  const approveContractbnb = useERC20(bnbVaultAddress)
  const handleApproveBnb = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    // setIsApproving(true)
    try {
      const tx = await approveContractbnb.approve(vaultAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      // setIsApproving(false)
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
        radio.toUpperCase().replace('WBNB', 'BNB') === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
        history.push('/farms')
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput('')
      setQuoteTokenInput('')
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const minLPAmountValue = farmData ? farmData[12] : 0
    const minLPAmount = getDecimalAmount(new BigNumber(minLPAmountValue), 18).toString().replace(/\.(.*?\d*)/g, '') // minLPAmountValue.toString()
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString().replace(/\.(.*?\d*)/g, '')
    // getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()
    const maxReturn = 0
    let amount
    let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    let contract
    let wrapFlag = false

    // base token is base token
    if (radio === tokenData?.TokenInfo?.token?.symbol) {
      // single base token
      if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) === 0) {
        console.info('base + single + token input ')
        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
        console.info('base + single + quote token input ')
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '1']) // [param.farmingTokenAmount, param.minLPAmount])  last 1, represent advanced farm
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + all ')
        farmingTokenAmount = getDecimalAmount(new BigNumber(quoteTokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')

        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, minLPAmount, '1'])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = vaultContract
      amount = getDecimalAmount(new BigNumber(tokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
      workerAddress = tokenData.TokenInfo.address
    } else {
      // farm token is base token
      if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
        console.info('farm + single + token input ')
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256'], ['1', '1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) === 0) {
        console.info('farm + single + quote token input ')
        wrapFlag = true
        farmingTokenAmount = getDecimalAmount(new BigNumber(tokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('farm + all ')
        wrapFlag = true
        farmingTokenAmount = getDecimalAmount(new BigNumber(tokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256', 'uint256'], [farmingTokenAmount, '1', '1'])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = quoteTokenVaultContract
      amount = getDecimalAmount(new BigNumber(quoteTokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
      workerAddress = tokenData.QuoteTokenInfo.address
    }

    console.log({
      radio,
      minLPAmount,
      tokenName,
      "ethers.utils.parseEther(minLPAmount)": ethers.utils.parseEther(minLPAmount),
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
      tokenData,
      tokenInput,
      'token8888Input': (tokenInput),
      quoteTokenInput,
      'quoteToken9999Input': (quoteTokenInput)
    })

    if (tokenData?.lpSymbol.toUpperCase().includes('BNB') && radio.toUpperCase().replace('WBNB', 'BNB') !== 'BNB' && wrapFlag) {
      const bnbMsgValue = getDecimalAmount(new BigNumber(tokenInput || 0), 18).toString().replace(/\.(.*?\d*)/g, '')
      console.info('wrap bnb', bnbMsgValue)
      handleDeposit(bnbMsgValue)

      const allowance = tokenData?.userData?.tokenUserTokenAllowances // ? tokenData?.userData?.allowance : token?.userData?.allowance
      console.info('wbnb  allowance ', allowance)
      if (Number(allowance) === 0) {
        handleApproveBnb()
      }

    }
    handleFarm(contract, id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  let tradingFeesfarm = farmData?.[5] * 100
  if (tradingFeesfarm < 0 || tradingFeesfarm > 1 || tradingFeesfarm.toString() === 'NaN') {
    tradingFeesfarm = 0
  }

  let priceImpact = farmData?.[4]
  if (priceImpact < 0.0000001 || priceImpact > 1) {
    priceImpact = 0
  }

  const {
    targetRef: priceImpactTargetRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t('Price impact will be calculated based on your supplied asset value and the current price.')}</Text>
    </>,
    { placement: 'top-start' },
  )
  const {
    targetRef: tradingFeesTargetRef,
    tooltip: tradingFeesTooltip,
    tooltipVisible: tradingFeesTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(
          'Trading fee collected by Huski Finance will be distributed based on our tokenomics. Go to ‘tokenomics’ for more information.',
        )}
      </Text>
    </>,
    { placement: 'top-start' },
  )

  const { allowance: quoteTokenUserQuoteTokenAllowances } = useTokenAllowance(
    getAddress(tokenData?.QuoteTokenInfo?.token?.address),
    tokenData?.TokenInfo?.vaultAddress,
  )
  const { allowance: tokenUserTokenAllowances } = useTokenAllowance(
    getAddress(tokenData?.TokenInfo?.token?.address),
    tokenData?.TokenInfo?.vaultAddress,
  )
  let allowance = '0'
  // if (
  //   radio?.toUpperCase().replace('WBNB', 'BNB') ===
  //   tokenData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
  // ) {
  //   allowance =
  //     Number(tokenData.userData?.quoteTokenUserQuoteTokenAllowances) > 0
  //       ? tokenData.userData?.quoteTokenUserQuoteTokenAllowances
  //       : quoteTokenUserQuoteTokenAllowances.toString()
  // } else {
  //   allowance = Number(tokenData.userData?.tokenUserTokenAllowances) > 0 ? tokenData.userData?.tokenUserTokenAllowances : tokenUserTokenAllowances.toString()
  // }



  // 判断 借哪个， 然后input输入的是哪个
  if (radio?.toUpperCase().replace('WBNB', 'BNB') === tokenData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')) {
    // jie base
    if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) === 0) {
      allowance = tokenData.userData?.tokenUserTokenAllowances  // > 0 ? tokenData.userData?.tokenUserTokenAllowances : tokenUserTokenAllowances.toString()
      console.info('token token ')
    } else if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
      allowance = tokenData.userData?.quoteTokenUserTokenAllowances
      console.info('token quotetoken ')
    } else if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) !== 0) {
      console.info('token all ! == 0 ')
      allowance = Number(tokenData.userData?.tokenUserTokenAllowances) > 0 ? tokenData.userData?.quoteTokenUserTokenAllowances : tokenData.userData?.tokenUserTokenAllowances
    } else {
      console.info('token all === 0 ')
      allowance = '1'

    }

  } else if (radio?.toUpperCase().replace('WBNB', 'BNB') === tokenData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')) {

    if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
      allowance = tokenData.userData?.quoteTokenUserQuoteTokenAllowances
      console.info('quotetoken token ')
    } else if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) === 0) {
      allowance = tokenData.userData?.tokenUserQuoteTokenAllowances
      console.info('quotetoken quotetoken ')
    } else if (Number(tokenInput || 0) !== 0 && Number(quoteTokenInput || 0) !== 0) {
      console.info('quotetoken all !== 0  youdianwenti xuyao yanzheng shifou qufen')
      allowance = Number(tokenData.userData?.tokenUserQuoteTokenAllowances) > 0 ? tokenData.userData?.tokenUserQuoteTokenAllowances : tokenData.userData?.tokenUserQuoteTokenAllowances

    } else {
      console.info('quotetoken all === 0 ')
      allowance = '1'

    }

  }

  const isApproved = Number(allowance) > 0
  const tokenAddress = getAddress(tokenData.TokenInfo.token.address)
  const quoteTokenAddress = getAddress(tokenData.TokenInfo.quoteToken.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  console.log({ 'approve===': tokenData, isApproved })
  const handleApprove = async () => {
    // not sure contract param is right? but can sussess
    let contract
    let approveAddress
    // if (radio?.toUpperCase() === tokenData?.TokenInfo?.quoteToken?.symbol.toUpperCase()) {
    //   contract = quoteTokenApproveContract // quoteTokenApproveContract
    //   approveAddress = quoteTokenVaultAddress // vaultAddress
    //   console.info('app quoteToken quoteTokenApproveContract quoteTokenVaultAddress')
    // } else {
    //   contract = quoteTokenApproveContract // approveContract
    //   approveAddress = vaultAddress // quoteTokenVaultAddress
    //   console.info('app quoteToken quoteTokenApproveContract vaultAddress')
    // }



    if (radio?.toUpperCase().replace('WBNB', 'BNB') === tokenData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')) {
      // jie base
      if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
        console.info('token quoteTokenApproveContract vaultAddress ')
        //  token quotetoken
        contract = quoteTokenApproveContract
        approveAddress = vaultAddress
      } else {
        console.info('token-- approveContract vaultAddress ')
        contract = approveContract
        approveAddress = vaultAddress
      }

    } else if (radio?.toUpperCase().replace('WBNB', 'BNB') === tokenData?.TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')) {

      if (Number(tokenInput || 0) === 0 && Number(quoteTokenInput || 0) !== 0) {
        contract = quoteTokenApproveContract
        approveAddress = quoteTokenVaultAddress
        console.info(' quoteTokenApproveContract quoteTokenVaultAddress ')
      } else {
        console.info(' approveContract quoteTokenVaultAddress ')
        contract = approveContract
        approveAddress = quoteTokenVaultAddress
      }

    }

    console.log({ contract, approveAddress })

    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await contract.approve(approveAddress, ethers.constants.MaxUint256)
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

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  const principal = 1
  const maxValue = 1 - principal / tokenData?.leverage
  const debtRatio = 1 - principal / leverageValue
  const liquidationThreshold = Number(tokenData?.liquidationThreshold) / 100

  const targetRef = useRef<any>()
  const [moveVal, setMoveVal] = useState({ width: 0, height: 0 })
  const [margin, setMargin] = useState(0)
  useLayoutEffect(() => {
    if (targetRef.current !== null && targetRef.current !== undefined) {
      setMoveVal({
        width: targetRef?.current?.offsetWidth,
        height: targetRef?.current?.offsetHeight,
      })
    }
  }, [leverageValue])

  useEffect(() => {
    const tt = ((leverageValue - 1) / 2) * moveVal.width
    if (tt === 0) {
      setMargin(tt - leverageValue * 9 + 10)
    } else {
      setMargin(tt - leverageValue * 9)
    }
  }, [leverageValue, moveVal.width])

  const getSelectedToken = (name: string) => {
    let selectedToken
    if (tokenData?.TokenInfo?.token?.symbol.toUpperCase() === name.toUpperCase()) {
      selectedToken = tokenData?.TokenInfo?.token
    } else {
      selectedToken = tokenData?.TokenInfo?.quoteToken
    }
    return { selectedToken }
  }
  const { selectedToken } = getSelectedToken(radio)
  const minimumDebt =
    radio === tokenData?.TokenInfo?.token?.symbol
      ? new BigNumber(tokenData?.tokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))
      : new BigNumber(tokenData?.quoteTokenMinDebtSize).div(new BigNumber(BIG_TEN).pow(18))

  const getWrapText = (): string => {
    const bnbInput = tokenData?.TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB') === 'BNB' ? tokenInput : quoteTokenInput
    if (tokenData?.lpSymbol.toUpperCase().includes('BNB') && radio.toUpperCase().replace('WBNB', 'BNB') !== 'BNB' && bnbInput) {
      return t(`Wrap BNB & ${leverageValue}x Farm`)
    }
    return t(`${leverageValue}x Farm`)
  }
  return (
    <SBPage>
      <Text
        as="span"
        fontWeight="bold"
        fontSize="25px"
        style={{ textAlign: 'center', marginBottom: '-40px', marginTop: '1rem' }}
      >
        {t(`Farming ${token.toUpperCase().replace('WBNB', 'BNB')} Pools`)}
      </Text>
      <SectionWrapper>
        <Section className="main">
          <Flex alignItems="center" justifyContent="space-between" flexWrap='wrap'>
            <Text bold fontSize="18px" color="textFarm" as="span">
              {t('Collateral')}
            </Text>
            <Text as="span" fontSize="12px" mt="3px" color="textSubtle" minWidth={250}>
              {t('To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.')}
            </Text>
          </Flex>

          <Flex flexDirection="column" justifyContent="space-between" flex="1" paddingTop='0!important'>
            <div style={{ display: 'flex' }}>
              <Text as="span" mr="1rem" color="textSubtle">
                {t('Balance:')}
              </Text>
              {userQuoteTokenBalance ? (
                <Text color="textFarm">
                  {formatDisplayedBalance(
                    userQuoteTokenBalance.toJSON(),
                    tokenData?.TokenInfo.quoteToken?.decimalsDigits,
                  )}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </div>
            <Box>
              <InputArea
                justifyContent="space-between"
                mb="1rem"
                background="backgroundAlt"
                style={{ borderRadius: '12px' }}
                isDark={isDark}
              >
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px" ml="10px">
                    <TokenImage token={tokenData?.TokenInfo.quoteToken} width={40} height={40} />
                  </Box>
                  <StyledNumberInput placeholder="0.00" value={quoteTokenInput} onChange={handleQuoteTokenInput} />
                </Flex>
                <Text color="textFarm" mr="10px" fontWeight="700">
                  {quoteTokenName.replace('wBNB', 'BNB')}
                </Text>
              </InputArea>
              <ButtonArea justifyContent="space-between" background="backgroundAlt" isDark={isDark}>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  25%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  50%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  75%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  100%
                </StyledButton>
              </ButtonArea>
            </Box>

            <div style={{ display: 'flex', marginTop: '20px' }}>
              <Text as="span" mr="1rem" color="textSubtle">
                {t('Balance:')}
              </Text>
              {userTokenBalance ? (
                <Text color="textFarm">
                  {formatDisplayedBalance(userTokenBalance.toJSON(), tokenData?.TokenInfo.token?.decimalsDigits)}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </div>
            <Box>
              <InputArea
                justifyContent="space-between"
                mb="1rem"
                background="backgroundAlt.0"
                style={{ borderRadius: '12px' }}
                isDark={isDark}
              >
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px" ml="10px">
                    <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} />
                  </Box>
                  <StyledNumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                </Flex>
                <Text mr="10px" fontWeight="700">
                  {tokenName.replace('wBNB', 'BNB')}
                </Text>
              </InputArea>
              <ButtonArea justifyContent="space-between" isDark={isDark}>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setTokenInputToFraction}
                >
                  25%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setTokenInputToFraction}
                >
                  50%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setTokenInputToFraction}
                >
                  75%
                </StyledButton>
                <StyledButton
                  variant="secondary" isDark={isDark}
                  scale={isSmallScreen ? 'sm' : 'md'}
                  onClick={setTokenInputToFraction}
                >
                  100%
                </StyledButton>
              </ButtonArea>
            </Box>
            <Flex alignItems="center" justifyContent="space-between" mt="20px" mb="20px">
              <Text fontWeight="500">{t('Target Position Leverage')}</Text>
              <Text color="textSubtle">{t('3.00X')}</Text>
            </Flex>
            <Box>
              {/* <Text color="textSubtle" small>
                {t(
                  'You can increasing or decrease leverage by adding or reducing collateral,more leverage means more yields and higher risk,vice versa.',
                )}
              </Text> */}
              <MoveBox move={margin}>
                <Text color="#7B3FE4" bold>
                  {leverageValue}x
                </Text>
              </MoveBox>
              <Box ref={targetRef} style={{ width: '100%', position: 'relative' }}>
                <RangeInput
                  type="range"
                  min="1.0"
                  max={leverage}
                  step="0.01"
                  name="leverage"
                  value={leverageValue}
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
                {leverageValue < 1.5 ? (
                  <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                ) : (
                  <div
                    className="middle"
                    style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                  />
                )}
                {leverageValue < 2 ? (
                  <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                ) : (
                  <div
                    className="middle"
                    style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                  />
                )}
                {leverageValue < 2.5 ? (
                  <div style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }} />
                ) : (
                  <div
                    className="middle"
                    style={{ borderRadius: '50%', width: '12px', height: '12px', background: '#7B3FE4' }}
                  />
                )}
                <div
                  className="middle"
                  style={{ borderRadius: '50%', width: '12px', height: '12px', background: 'rgb(189,159,242)' }}
                />
              </Flex>
              <Text>
                <datalist style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} id="leverage">
                  {datalistOptions}
                </datalist>
              </Text>
            </Box>
          </Flex>

          <Box>
            <Text fontWeight="500" color="textFarm" fontSize="12px">
              {t('Which asset would you like to borrow?')}
            </Text>
            <Flex mt="10px">
              <Select options={options()} onChange={(option) => setRadio(option.value)} />
            </Flex>
          </Box>
          <Flex justifyContent="space-evenly" paddingBottom='20px!important'>
            {isApproved ? null : (
              <Button
                style={{ border: !isDark && '1px solid lightgrey', width: 290, height: 50 }}
                onClick={handleApprove}
                disabled={isApproving}
                isLoading={isApproving}
                endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
              >
                {isApproving ? t('Approving') : t('Approve')}
              </Button>
            )}
            <Button
              style={{ border: !isDark && '1px solid lightgrey', width: 290, height: 50 }}
              onClick={handleConfirm}
              isLoading={isPending}
              endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
              disabled={
                !account ||
                !isApproved ||
                (Number(tokenInput) === 0 && Number(quoteTokenInput) === 0) ||
                (tokenInput === undefined && quoteTokenInput === undefined) ||
                (Number(leverageValue) !== 1 ? new BigNumber(farmData[3]).lt(minimumDebt) : false) ||
                isPending
              }
            >
              {isPending ? t('Confirming') : t('Confirm')}
            </Button>
          </Flex>
          {tokenInput || quoteTokenInput ? (
            <Text mx="auto" color="red" textAlign='center'>
              {Number(leverageValue) !== 1 && new BigNumber(farmData[3]).lt(minimumDebt)
                ? t('Minimum Debt Size: %minimumDebt% %radio%', {
                  minimumDebt: minimumDebt.toNumber(),
                  radio: radio.toUpperCase().replace('WBNB', 'BNB'),
                })
                : null}
            </Text>
          ) : null}
        </Section>

        <Flex className="sideSection" >
          <Section>
            <Text small color="text" fontSize="16px">
              {t('My Debt Status')}
            </Text>
            <Flex height="150px" alignItems="center" style={{ border: 'none' }}>
              <DebtRatioProgress
                debtRatio={debtRatio * 100}
                liquidationThreshold={liquidationThreshold}
                max={maxValue * 100}
              />
            </Flex>
            <Text small color="textSubtle" mt="50px">
              {t('Keep in mind: when the price of BNB against BUSD decreases 60%, the debtratio will exceed the')}
            </Text>
          </Section>

          <Section>
            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                <Text color="text" fontWeight="500">
                  {t('APR')}
                </Text>
                <span>
                  {' '}
                  <InfoIcon color="textSubtle" ml="10px" />
                </span>
              </Flex>
              <Text>{totalAprDisplay.toFixed(2)}%</Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                <Text color="text" fontWeight="500">
                  {t('APY')}
                </Text>
                <span>
                  <InfoIcon color="textSubtle" ml="10px" />
                </span>
              </Flex>
              <Flex>
                <Text>{getDisplayApr(getApy(1))}%</Text>
                <ArrowForwardIcon />
                <Text>{getDisplayApr(getApy(leverageValue))}%</Text>
              </Flex>
            </Flex>
            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                <Text color="text" fontWeight="500">
                  {t('Asset Borrowed')}
                </Text>
              </Flex>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(3)} {radio.replace('wBNB', 'BNB')}
                </Text>
              ) : (
                <Text>0.00 {radio.replace('wBNB', 'BNB')}</Text>
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Flex alignItems="center">
                <Text color="text" fontWeight="500">
                  {t('Assets Supplied')}
                </Text>
              </Flex>
              <Text>
                {radio === tokenName ? Number(tokenInput || 0)?.toFixed(3) : Number(quoteTokenInput || 0)?.toFixed(3)}{' '}
                {radio.replace('wBNB', 'BNB')} +{' '}
                {radio === tokenName ? Number(quoteTokenInput || 0)?.toFixed(3) : Number(tokenInput || 0)?.toFixed(3)}{' '}
                {
                  radio === tokenName
                    ? quoteTokenName.replace('wBNB', 'BNB')
                    : tokenName.replace('wBNB', 'BNB') /* radioQuote.replace('wBNB', 'BNB') */
                }
              </Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Flex>
                <Text>{t('Price Impact')}</Text>
                {priceImpactTooltipVisible && priceImpactTooltip}
                <span ref={priceImpactTargetRef}>
                  <InfoIcon ml="10px" />
                </span>
              </Flex>
              {farmData ? <Text>{(farmData[4] * 100).toPrecision(3)}%</Text> : <Text> 0.00%</Text>}
            </Flex>
            <Flex justifyContent="space-between">
              <Flex>
                <Text>{t('Trading Fees')}</Text>
                {tradingFeesTooltipVisible && tradingFeesTooltip}
                <span ref={tradingFeesTargetRef}>
                  <InfoIcon color="textSubtle" ml="10px" />
                </span>
              </Flex>
              <Text>{tradingFeesfarm.toPrecision(3)}%</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Position Value')}</Text>
              {farmData ? (
                <Text fontWeight="700">
                  {farmData[8].toFixed(2)} {radio.replace('wBNB', 'BNB')} + {farmData[9].toFixed(2)}{' '}
                  {radio === tokenName ? quoteTokenName.replace('wBNB', 'BNB') : tokenName.replace('wBNB', 'BNB')}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            {/* <Flex justifyContent="space-between">
              <Text>{t('APR')}</Text>
              <Text>{totalAprDisplay.toFixed(2)}%</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('APY')}</Text>
              <Flex>
                <Text>{getDisplayApr(getApy(1))}%</Text>
                <ArrowForwardIcon />
                <Text>{getDisplayApr(getApy(leverageValue))}%</Text>
              </Flex>
            </Flex> */}

          </Section>
        </Flex>

      </SectionWrapper>


    </SBPage>
  )
}

export default Farm

// NOTE: javascript Number function and BigNumber.js toNumber() function might return a different value than the actual value
// if that value is bigger than MAX_SAFE_INTEGER. so needs to be careful when doing number operations.
// https://stackoverflow.com/questions/35727608/why-does-number-return-wrong-values-with-very-large-integers