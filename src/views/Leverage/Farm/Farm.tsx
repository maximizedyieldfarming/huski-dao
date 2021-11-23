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
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import DebtRatioProgress from 'components/DebRatioProgress'
import { useWeb3React } from '@web3-react/core'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getBorrowingInterest } from '../helpers'

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

const Farm = () => {
  const { token } = useParams<RouteParams>()
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const {
    state: { tokenData: data, selectedLeverage, selectedBorrowing },
  } = useLocation<LocationParams>()

  const [tokenData, setTokenData] = useState(data)
  const quoteTokenName = tokenData?.TokenInfo?.quoteToken?.symbol
  const tokenName = tokenData?.TokenInfo?.token?.symbol

  const [radio, setRadio] = useState(selectedBorrowing)
  const { leverage } = tokenData
  const [leverageValue, setLeverageValue] = useState(selectedLeverage)

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
  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const userTokenBalance = getBalanceAmount(
    tokenData?.TokenInfo?.token?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance,
  )
  const { balance: quoteTokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.quoteToken.address))
  const userQuoteTokenBalance = getBalanceAmount(
    tokenData?.TokenInfo?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : quoteTokenBalance,
  )

  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()

  const huskyRewards = getHuskyRewards(tokenData, huskyPrice, radio)
  const yieldFarmData = getYieldFarming(tokenData, cakePrice)

  const getDisplayApr = (cakeRewardsApr?: number) => {
    if (cakeRewardsApr) {
      return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
    }
    return null
  }

  const [tokenInput, setTokenInput] = useState(0)
  const tokenInputRef = useRef<HTMLInputElement>()
  const handleTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance],
  )

  const [quoteTokenInput, setQuoteTokenInput] = useState(0)
  const quoteTokenInputRef = useRef<HTMLInputElement>()
  const handleQuoteTokenInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals
      if (event.target.value.match(/^\d*\.?\d*$/) || event.target.value === '') {
        const input = event.target.value
        const finalValue = Number(input) > Number(userQuoteTokenBalance) ? userQuoteTokenBalance : input
        setQuoteTokenInput(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userQuoteTokenBalance],
  )

  const handleChange = (e) => {
    const { value } = e.target
    setRadio(value)
  }

  const setQuoteTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setQuoteTokenInput(userQuoteTokenBalance.toNumber())
    }
  }
  const setTokenInputToFraction = (e) => {
    if (e.target.innerText === '25%') {
      setTokenInput(userTokenBalance.toNumber() * 0.25)
    } else if (e.target.innerText === '50%') {
      setTokenInput(userTokenBalance.toNumber() * 0.5)
    } else if (e.target.innerText === '75%') {
      setTokenInput(userTokenBalance.toNumber() * 0.75)
    } else if (e.target.innerText === '100%') {
      setTokenInput(userTokenBalance.toNumber())
    }
  }

  const farmingData = getLeverageFarmingData(tokenData, leverageValue, tokenInput, quoteTokenInput, radio)
  const farmData = farmingData ? farmingData[1] : []
  const { borrowingInterest } = getBorrowingInterest(tokenData, radio)

  const getApr = (lvg) => {
    const totalapr =
      Number((yieldFarmData / 100) * lvg) +
      Number(((tokenData.tradeFee * 365) / 100) * lvg) +
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
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your farm was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError('Unsuccessfulll', 'Something went wrong your farm request. Please try again...')
    } finally {
      setIsPending(false)
      setTokenInput(0)
      setQuoteTokenInput(0)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder
    let amount
    let workerAddress
    let farmingTokenAmount
    let strategiesAddress
    let dataStrategy
    let dataWorker
    let contract

    // base token is base token
    if (radio === tokenData?.TokenInfo?.token?.symbol) {
      // single base token
      if (Number(tokenInput) !== 0 && Number(quoteTokenInput) === 0) {
        console.info('base + single + token input ')
        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInput) === 0 && Number(quoteTokenInput) !== 0) {
        console.info('base + single + quote token input ')
        farmingTokenAmount = Number(quoteTokenInput).toString()
        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('base + all ')
        farmingTokenAmount = Number(quoteTokenInput).toString()
        strategiesAddress = tokenData.TokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = vaultContract
      amount = getDecimalAmount(new BigNumber(Number(tokenInput)), 18).toString()
      workerAddress = tokenData.TokenInfo.address
    } else {
      // farm token is base token
      if (Number(tokenInput) === 0 && Number(quoteTokenInput) !== 0) {
        console.info('farm + single + token input ')
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddAllBaseToken
        dataStrategy = ethers.utils.defaultAbiCoder.encode(['uint256'], ['1'])
        dataWorker = ethers.utils.defaultAbiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else if (Number(tokenInput) !== 0 && Number(quoteTokenInput) === 0) {
        console.info('farm + single + quote token input ')
        farmingTokenAmount = Number(tokenInput).toString()
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      } else {
        console.info('farm + all ')
        farmingTokenAmount = Number(tokenInput).toString()
        strategiesAddress = tokenData.QuoteTokenInfo.strategies.StrategyAddTwoSidesOptimal
        dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
        dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
      }
      contract = quoteTokenVaultContract
      amount = getDecimalAmount(new BigNumber(Number(quoteTokenInput)), 18).toString()
      workerAddress = tokenData.QuoteTokenInfo.address
    }

    // console.log({
    //   id,
    //   workerAddress,
    //   amount,
    //   loan,
    //   AssetsBorrowed,
    //   maxReturn,
    //   farmingTokenAmount,
    //   dataWorker,
    //   strategiesAddress,
    //   dataStrategy,
    //   tokenInput,
    //   'a': Number(tokenInput),
    //   quoteTokenInput,
    //   'b': Number(quoteTokenInput)
    // })

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

  let allowance = '0'
  if (radio?.toUpperCase() === tokenData?.quoteToken?.symbol.toUpperCase()) {
    allowance = tokenData.userData?.quoteTokenAllowance
  } else {
    allowance = tokenData.userData?.tokenAllowance
  }
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const tokenAddress = getAddress(tokenData.TokenInfo.token.address)
  const quoteTokenAddress = getAddress(tokenData.TokenInfo.quoteToken.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    // not sure contract param is right? but can sussess
    let contract
    if (radio?.toUpperCase() === tokenData?.quoteToken?.symbol.toUpperCase()) {
      contract = approveContract // quoteTokenApproveContract
    } else {
      contract = quoteTokenApproveContract // approveContract
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

  const { isMobile, isTable } = useMatchBreakpoints()
  const isMobileOrTable = isMobile || isTable

  const principal = 1
  const maxValue = 1 - principal / tokenData?.leverage
  const debtRatio = 1 - principal / leverageValue
  const liquidationThreshold = Number(tokenData?.liquidationThreshold) / 100

  return (
    <Page>
      <Text as="span" fontWeight="bold" style={{ alignSelf: 'center' }}>
        {t(`Farming ${token} Pools`)}
      </Text>
      <SectionWrapper>
        <Section className="gray">
          <Flex alignItems="center" justifyContent="space-between">
            <Text as="span">{t('Collateral')}</Text>
            <Text as="span" small color="textSubtle">
              {t('To form a yield farming position,assets deposited will be converted to LPs based on a 50:50 ratio.')}
            </Text>
          </Flex>
          <Flex flexDirection="column" justifyContent="space-between" flex="1">
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  {t('Balance:')}
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
                    <TokenImage token={tokenData?.TokenInfo.quoteToken} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={quoteTokenInput} onChange={handleQuoteTokenInput} />
                </Flex>
                <Text>{quoteTokenName.replace('wBNB', 'BNB')}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button
                  variant="secondary"
                  scale={isMobileOrTable ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  25%
                </Button>
                <Button
                  variant="secondary"
                  scale={isMobileOrTable ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  50%
                </Button>
                <Button
                  variant="secondary"
                  scale={isMobileOrTable ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  75%
                </Button>
                <Button
                  variant="secondary"
                  scale={isMobileOrTable ? 'sm' : 'md'}
                  onClick={setQuoteTokenInputToFraction}
                >
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Flex alignItems="center">
                <Text as="span" mr="1rem">
                  {t('Balance:')}
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
                    <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} />
                  </Box>
                  <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                </Flex>
                <Text>{tokenName.replace('wBNB', 'BNB')}</Text>
              </InputArea>
              <Flex justifyContent="space-around">
                <Button variant="secondary" scale={isMobileOrTable ? 'sm' : 'md'} onClick={setTokenInputToFraction}>
                  25%
                </Button>
                <Button variant="secondary" scale={isMobileOrTable ? 'sm' : 'md'} onClick={setTokenInputToFraction}>
                  50%
                </Button>
                <Button variant="secondary" scale={isMobileOrTable ? 'sm' : 'md'} onClick={setTokenInputToFraction}>
                  75%
                </Button>
                <Button variant="secondary" scale={isMobileOrTable ? 'sm' : 'md'} onClick={setTokenInputToFraction}>
                  100%
                </Button>
              </Flex>
            </Box>
            <Box>
              <Text color="textSubtle" small>
                {t(
                  'You can increasing or decrease leverage by adding or reducing collateral,more leverage means more yields and higher risk,vice versa.',
                )}
              </Text>
              <Flex alignItems="center">
                <Text bold>{t('Increase or decrease leverage')}</Text>
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
                  style={{ width: '90%' }}
                />
                <datalist id="leverage">{datalistOptions}</datalist>
                <Box ml="auto">
                  <Text textAlign="right">{leverageValue}X</Text>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Box>
            <Text bold>{t('Which asset would you like to borrow?')}</Text>
            <Flex>
              {quoteTokenName.toLowerCase() !== 'cake' && (
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
              )}
              {tokenName.toLowerCase() !== 'cake' && (
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
              )}
            </Flex>
          </Box>
          <Box>
            <Text small color="failure">
              {t(
                'Please keep in mind that when you leverage above 2x, you will have a slight short on the borrowed asset.The other paired asset will have typical long exposure, so choose which asset you borrow wisely.',
              )}
            </Text>
          </Box>
        </Section>

        <Flex className="sideSection" justifyContent="space-around">
          <Section>
            <Flex height="100px" alignItems="center">
              <DebtRatioProgress
                debtRatio={debtRatio * 100}
                liquidationThreshold={liquidationThreshold}
                max={maxValue * 100}
              />
            </Flex>
            <Text small color="failure">
              {t(
                'Keep in mind: when the price of BNB against BUSD decreases 60%, the debt ratio will exceed the liquidation ratio, your assets might encounter liquidation.',
              )}
            </Text>
          </Section>

          <Section>
            <Flex justifyContent="space-between">
              <Text>{t('Assets Supplied')}</Text>
              <Text>
                {radio === tokenName ? Number(tokenInput)?.toPrecision(4) : Number(quoteTokenInput)?.toPrecision(4)}{' '}
                {radio.replace('wBNB', 'BNB')} +{' '}
                {radio === tokenName ? Number(quoteTokenInput)?.toPrecision(4) : Number(tokenInput)?.toPrecision(4)}{' '}
                {
                  radio === tokenName
                    ? quoteTokenName.replace('wBNB', 'BNB')
                    : tokenName.replace('wBNB', 'BNB') /* radioQuote.replace('wBNB', 'BNB') */
                }
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Assets Borrowed')}</Text>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(2)} {radio.replace('wBNB', 'BNB')}
                </Text>
              ) : (
                <Text>0.00 {radio.replace('wBNB', 'BNB')}</Text>
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Flex>
                <Text>{t('Price Impact')}</Text>
                {priceImpactTooltipVisible && priceImpactTooltip}
                <span ref={priceImpactTargetRef}>
                  <InfoIcon ml="10px" />
                </span>
              </Flex>
              {farmData ? (
                <Text color="#1DBE03">+{(farmData[4] * 100).toPrecision(3)} %</Text>
              ) : (
                <Text color="#1DBE03"> 0.00 %</Text>
              )}
            </Flex>
            <Flex justifyContent="space-between">
              <Flex>
                <Text>{t('Trading Fees')}</Text>
                {tradingFeesTooltipVisible && tradingFeesTooltip}
                <span ref={tradingFeesTargetRef}>
                  <InfoIcon ml="10px" />
                </span>
              </Flex>
              <Text color="#EB0303">-{tradingFeesfarm.toPrecision(3)} %</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text>{t('Position Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[8].toFixed(2)} {radio.replace('wBNB', 'BNB')} + {farmData[9].toFixed(2)}{' '}
                  {radio === tokenName ? quoteTokenName.replace('wBNB', 'BNB') : tokenName.replace('wBNB', 'BNB')}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex justifyContent="space-between">
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
            </Flex>
          </Section>
        </Flex>
      </SectionWrapper>
      <Flex justifyContent="space-evenly">
        {isApproved ? null : <Button onClick={handleApprove}>{t('Approve')}</Button>}
        <Button
          onClick={handleConfirm}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          disabled={
            !account ||
            !isApproved ||
            (Number(tokenInput) === 0 && Number(quoteTokenInput) === 0) ||
            (tokenInput === undefined && quoteTokenInput === undefined) ||
            isPending
          }
        >
          {isPending ? t('Confirming') : t(`${leverageValue}x Farm`)}
        </Button>
      </Flex>
    </Page>
  )
}

export default Farm
