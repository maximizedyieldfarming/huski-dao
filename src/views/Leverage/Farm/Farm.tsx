import React, { useState, useEffect, useCallback, useRef, RefObject, useMemo } from 'react'
import { useParams } from 'react-router'
import Page from 'components/Layout/Page'
import { Box, Button, Flex, Radio, InfoIcon, Text, Skeleton, useTooltip, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenImage } from 'components/TokenImage'
import { useHuskyPrice, useHuskyPerBlock, useCakePrice } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers';
import { useTranslation } from 'contexts/Localization'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData } from '../helpers'
import image from './assets/huskyBalloon.png'

interface RouteParams {
  token: string
}

const Section = styled(Box)`
  &:first-of-type {
    background-color: ${({ theme }) => theme.colors.disabled};
  }
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  &:not(:first-child) {
    > ${Flex} {
      padding: 1.5rem 0;
      &:not(:last-child) {
        border-bottom: 1px solid #a41ff81a;
      }
    }
  }
  /*  > ${Flex} {
    > div:first-child {
      flex: 1;
    }
  } */
  input[type='range'] {
    -webkit-appearance: auto;
  }
`

const InputArea = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0.5rem;
  flex: 1;
  align-items: center;
`

const Farm = (props) => {
  console.log('props to adjust position...', props)

  const { token } = useParams<RouteParams>()
  const { t } = useTranslation()
  const {
    location: {
      state: { tokenData: data },
    },
  } = props
  const [tokenData, setTokenData] = useState(data)

  const quoteTokenName = tokenData?.quoteToken?.symbol
  const tokenName = tokenData?.token?.symbol

  const [tokenInputOther, setTokenInputOther] = useState(0)
  const [quoteTokenInputOther, setQuoteTokenInputOther] = useState(0)
  const [radio, setRadio] = useState(tokenName)
  const [radioQuote, setRadioQuote] = useState(quoteTokenName)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(leverage)

  const handleSliderChange = (e) => {
    const value = e?.target?.value
    setLeverageValue(value)
  }

  const datalistSteps = []
  const datalistOptions = (() => {
    for (let i = 1; i < leverage / 0.5; i++) {
      datalistSteps.push(1 + 0.5 * (-1 + i))
    }
    return datalistSteps.map((value) => <option value={value} label={value} />)
  })()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.token.address))
  const userTokenBalance = getBalanceAmount(
    tokenData?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(tokenData.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    tokenData?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const huskyPrice = useHuskyPrice()
  const huskyPerBlock = useHuskyPerBlock()
  const cakePrice = useCakePrice()

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, huskyPerBlock, leverageValue)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [tokenInput, setTokenInput] = useState<number>(0)
  const tokenInputRef = useRef<HTMLInputElement>()
  const handleTokenInput = useCallback((event) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(event.key)) {
      event.preventDefault()
    }
    const input = event.target.value
    setTokenInput(input)
    setTokenInputOther(input)
  }, [])

  const [quoteTokenInput, setQuoteTokenInput] = useState<number>(0)
  const quoteTokenInputRef = useRef<HTMLInputElement>()
  const handleQuoteTokenInput = useCallback((event) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(event.key)) {
      event.preventDefault()
    }
    const input = event.target.value
    setQuoteTokenInput(input)
    setQuoteTokenInputOther(input)
  }, [])

  const handleChange = (e) => {
    const { value } = e.target
    setRadio(value)
    if (value === tokenData.token.symbol) {
      setRadioQuote(tokenData.quoteToken.symbol)
      setTokenInputOther(tokenInput)
      setQuoteTokenInputOther(quoteTokenInput)
    } else {
      setRadioQuote(tokenData.token.symbol)
      setTokenInputOther(quoteTokenInput)
      setQuoteTokenInputOther(tokenInput)
    }
  }

  const setQuoteTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.25)
      setQuoteTokenInputOther(userQuoteTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.5)
      setQuoteTokenInputOther(userQuoteTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.75)
      setQuoteTokenInputOther(userQuoteTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber())
      setQuoteTokenInputOther(userQuoteTokenBalance.toNumber())
    }
  }
  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.toNumber() * 0.25)
      setTokenInputOther(userTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.toNumber() * 0.5)
      setTokenInputOther(userTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.toNumber() * 0.75)
      setTokenInputOther(userTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toNumber())
      setTokenInputOther(userTokenBalance.toNumber())
    }
  }

  const farmingData = getLeverageFarmingData(tokenData, leverageValue, tokenInput, quoteTokenInput)
  const farmData = farmingData ? farmingData[1] : []
  const apy = getDisplayApr(yieldFarmData * leverageValue)
  const apyAtOne = getDisplayApr(yieldFarmData * 1)
  const BorrowingInterestNumber = new BigNumber(tokenData?.borrowingInterest).div(BIG_TEN.pow(18)).toNumber() * 100
  const tradingFees = Number(tokenData?.tradeFee) * Number(leverageValue) * 365
  const apr = Number(yieldFarmData) + Number(tradingFees) + Number(huskyRewards * 100) - Number(BorrowingInterestNumber)

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const vaultAddress = getAddress(tokenData.vaultAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
 

  const handleFarm = async (id, workerAddress, amount, loan, maxReturn, dataWorker) => { 
    const callOptions = {
    gasLimit: 3800000,
  
  }
 // value: amount
    try {
      const tx = await callWithGasPrice(vaultContract, 'work', [id, workerAddress, amount, loan, maxReturn, dataWorker], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    }
  }

  const handleConfirm = async () => {
    const id = 0// tokenData.pid
    const workerAddress = getAddress(tokenData.workerAddress)
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const amount = getDecimalAmount(new BigNumber(tokenInput), 18).toString()// basetoken input
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString()// Assets Borrowed
    const maxReturn = 0

    const abiCoder = ethers.utils.defaultAbiCoder;
    
// 单币 只有base token 
    // const strategiesAddress = getAddress(tokenData.strategies.addAllBaseToken)
    // const dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1']);
    // const dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy]);

// 双币 
const strategiesAddress = getAddress(tokenData.strategies.addTwoSidesOptimal)
const dataStrategy = abiCoder.encode(['uint256', 'uint256'], [parseInt(tokenData.quoteTokenAmountTotal), 1]);
const dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy]);


console.log({id, workerAddress, amount, loan, maxReturn, dataWorker,strategiesAddress, dataStrategy});
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  let tradingFeesfarm = farmData?.[5] * 100
  if (tradingFeesfarm < 0 || tradingFeesfarm > 1 || tradingFeesfarm.toString() === 'NaN') {
    tradingFeesfarm = 0;
  }

  let priceImpact = farmData?.[4]
  if (priceImpact < 0.0000001 || priceImpact > 1) {
    priceImpact = 0;
  }

  const {
    targetRef: priceImpactTargetRef,
    tooltip: priceImpactTooltip,
    tooltipVisible: priceImpactTooltipVisible,
  } = useTooltip(
    <>
      <Text>Price impact will be calculated based on your supplied asset value and the current price.</Text>
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
        Trading fee collected by Huski Finance will be distributed based on our tokenomics. Go to ‘tokenomics’ for more
        information.
      </Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <Page>
      <Text as="span" fontWeight="bold" style={{ alignSelf: 'center' }}>
        Farming {token} Pools
      </Text>
      <Section>
        <Flex alignItems="center" justifyContent="space-between">
          <Text as="span">Collateral</Text>
          <Text as="span" small color="textSubtle">
            To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.
          </Text>
        </Flex>
        <Flex>
          <Flex flexDirection="column" justifyContent="space-between" flex="1">
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  Balance:
                </Text>
                {userQuoteTokenBalance ? (
                  <Text>{userQuoteTokenBalance.toNumber().toPrecision(3)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.quoteToken} width={40} height={40} />
                  </Box>
                  <NumberInput
                    // type="number"
                    placeholder="0.00"
                    value={quoteTokenInput}
                    // ref={quoteTokenInputRef as RefObject<HTMLInputElement>}
                    onChange={handleQuoteTokenInput}
                    // ref={(input) => numberInputRef.current.push(input)}
                  />
                </Flex>
                <Text>{quoteTokenName.replace('wBNB', 'BNB')}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  25%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  50%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  75%
                </Button>
                <Button variant="secondary" onClick={setQuoteTokenInputToFraction}>
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  Balance:
                </Text>
                {userTokenBalance ? (
                  <Text>{userTokenBalance.toNumber().toPrecision(3)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt.0">
                <Flex alignItems="center" flex="1">
                  <Box width={40} height={40} mr="5px">
                    <TokenImage token={tokenData?.token} width={40} height={40} />
                  </Box>
                  <NumberInput
                    // type="number"
                    placeholder="0.00"
                    value={tokenInput}
                    // ref={tokenInputRef as RefObject<HTMLInputElement>}
                    onChange={handleTokenInput}
                    // ref={(input) => numberInputRef.current.push(input)}
                  />
                </Flex>
                <Text>{tokenName.replace('wBNB', 'BNB')}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  25%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  50%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  75%
                </Button>
                <Button variant="secondary" onClick={setTokenInputToFraction}>
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Text color="textSubtle" small>
                You can increasing or decrease leverage by adding or reducing collateral,more leverage means more yields
                and higher risk,vice versa.
              </Text>
              <Flex alignItems="center">
                <Text bold>Increase or decrease leverage</Text>
              </Flex>

              <Flex>
                <input
                  type="range"
                  min="1.0"
                  max={leverage}
                  step="0.01"
                  name="leverage"
                  value={leverageValue}
                  onChange={handleSliderChange}
                  list="leverage"
                />
                <datalist id="leverage">{datalistOptions}</datalist>
                <Box ml="10px" width="15px">
                  <Text textAlign="right">{leverageValue}X</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Flex flex="0.5">
            <img src={image} alt="" />
          </Flex>
        </Flex>
        <Box>
          <Text bold>Which asset would you like to borrow? </Text>
          <Flex>
            <Flex alignItems="center" marginRight="10px">
              <Text mr="5px">{quoteTokenName.replace('wBNB', 'BNB')}</Text>
              <Radio
                // name="token"
                scale="sm"
                value={quoteTokenName}
                onChange={handleChange}
                checked={radio === quoteTokenName}
              />
            </Flex>
            <Flex alignItems="center">
              <Text mr="5px">{tokenName.replace('wBNB', 'BNB')}</Text>
              <Radio
                //  name="token"
                scale="sm"
                value={tokenName}
                onChange={handleChange}
                checked={radio === tokenName}
              />
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Text small color="failure">
            Please keep in mind that when you leverage above 2x, you will have a slight short on the borrowed asset.The
            other paired asset will have typical long exposure, so choose which asset you borrow wisely.
          </Text>
        </Box>
      </Section>

      <Section>
        <Text small color="failure">
          Keep in mind: when the price of BNB against BUSD decreases 60%, the debt ratio will exceed the liquidation
          ratio, your assets might encounter liquidation.
        </Text>
      </Section>

      <Section>
        <Flex justifyContent="space-between">
          <Text>Assets Supplied</Text>
          <Text>
            {tokenInputOther} {radio.replace('wBNB', 'BNB')} + {quoteTokenInputOther}{' '}
            {radioQuote.replace('wBNB', 'BNB')}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Assets Borrowed</Text>
          {farmData[3] ? (
            <Text>
              {farmData[3]?.toFixed(2)} {radio}
            </Text>
          ) : (
            <Text>0.00 {radio.replace('wBNB', 'BNB')}</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Price Impact</Text>
            {priceImpactTooltipVisible && priceImpactTooltip}
            <span ref={priceImpactTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
          {farmData[4] ? (
            <Text color="#1DBE03">+{(farmData[4]*100).toPrecision(3)} %</Text>
          ) : (
            <Text color="#1DBE03"> 0.00 %</Text>
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Flex>
            <Text>Trading Fees</Text>
            {tradingFeesTooltipVisible && tradingFeesTooltip}
            <span ref={tradingFeesTargetRef}>
              <InfoIcon ml="10px" />
            </span>
          </Flex>
            <Text color="#EB0303">-{(tradingFeesfarm).toPrecision(3)} %</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>Position Value</Text>
          {farmData ? (
            <Text>
              {farmData[8].toFixed(2)} {radio.replace('wBNB', 'BNB')} + {farmData[9].toFixed(2)}{' '}
              {radioQuote.replace('wBNB', 'BNB')}
            </Text>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
        <Flex justifyContent="space-between">
          <Text>APR</Text>
          <Text>{apr.toPrecision(3)}%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>APY</Text>
          <Flex>
            <Text>{apyAtOne}%</Text>
            <ArrowForwardIcon />
            <Text>{apy}%</Text>
          </Flex>
        </Flex>
      </Section>
      <Flex justifyContent="space-evenly">
      {/* <Button onClick={handleApprove}>Approve</Button> */}
        <Button onClick={handleConfirm}>{leverageValue}X Farm</Button>
      </Flex>
    </Page>
  )
}

export default Farm
