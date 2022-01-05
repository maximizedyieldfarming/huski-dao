import React, { useState } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  useTooltip,
  InfoIcon,
  Skeleton,
  Button,
  AutoRenewIcon,
} from '@huskifinance/huski-frontend-uikit'
import useToast from 'hooks/useToast'
import { useVault } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import styled, { useTheme } from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { TRADE_FEE } from 'config'
import { ethers } from 'ethers'
import { TokenPairImage } from 'components/TokenImage'
import { ArrowDownIcon } from 'assets'
import { useWeb3React } from '@web3-react/core'
import { getBalanceAmount, formatNumber } from 'utils/formatBalance'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

interface LocationParams {
  data: any
}

const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 0 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  gap: 10px;
`

const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 12px;
  width: 95%;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 510px;
  }
  max-height: 528px;
  padding: 1rem;
  > * {
    margin: 1rem 0;
  }
`
const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.small};
  justify-content: space-between;
  &.gray {
  }
`

const ClosePositionSA = () => {
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()
  const history = useHistory()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('text')}</Text>
    </>,
    { placement: 'right' },
  )
  const { positionId, debtValue, lpAmount, vault } = data
  const {
    TokenInfo,
    QuoteTokenInfo,
    tokenPriceUsd,
    quoteTokenPriceUsd,
    lptotalSupply,
    tokenAmountTotal,
    quoteTokenAmountTotal,
  } = data.farmData

  const { balance: tokenBalance } = useTokenBalance(getAddress(TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()
  const userTokenBalanceIb = getBalanceAmount(useTokenBalance(data.farmData?.TokenInfo.vaultAddress).balance).toJSON()
  // console.log(userTokenBalanceIb);

  const userTokenBalance = getBalanceAmount(
    TokenInfo.token.symbol.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance,
  ).toJSON()

  // console.log(data);

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenVaultAddress = TokenInfo?.vaultAddress
  const quoteTokenVaultAddress = QuoteTokenInfo?.vaultAddress
  const vaultContract = useVault(tokenVaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { isDark } = useTheme()

  let symbolName
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
  let contract
  let lpSymbolName

  if (vault.toUpperCase() === TokenInfo.vaultAddress.toUpperCase()) {
    symbolName = TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    tokenValue = TokenInfo?.token
    quoteTokenValue = TokenInfo?.quoteToken
    tokenPrice = tokenPriceUsd
    quoteTokenPrice = quoteTokenPriceUsd
    tokenValueSymbol = TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    quoteTokenValueSymbol = TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
    baseTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(tokenAmountTotal)
    farmingtokenBegin = parseInt(quoteTokenAmountTotal)
    workerAddress = TokenInfo.address
    withdrawMinimizeTradingAddress = TokenInfo.strategies.StrategyLiquidate
    contract = vaultContract
    lpSymbolName = TokenInfo?.name
  } else {
    symbolName = TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
    tokenValue = TokenInfo?.quoteToken
    quoteTokenValue = TokenInfo?.token
    tokenPrice = quoteTokenPriceUsd
    quoteTokenPrice = tokenPriceUsd
    tokenValueSymbol = TokenInfo?.quoteToken?.symbol.toUpperCase().replace('WBNB', 'BNB')
    quoteTokenValueSymbol = TokenInfo?.token?.symbol.toUpperCase().replace('WBNB', 'BNB')
    baseTokenAmount = new BigNumber(quoteTokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    farmTokenAmount = new BigNumber(tokenAmountTotal).div(new BigNumber(lptotalSupply)).times(lpAmount)
    basetokenBegin = parseInt(quoteTokenAmountTotal)
    farmingtokenBegin = parseInt(tokenAmountTotal)
    workerAddress = QuoteTokenInfo.address
    withdrawMinimizeTradingAddress = QuoteTokenInfo.strategies.StrategyLiquidate
    contract = quoteTokenVaultContract
    lpSymbolName = QuoteTokenInfo?.name
  }

  const debtValueNumber = new BigNumber(debtValue).dividedBy(BIG_TEN.pow(18)).toNumber()
  const convertedPositionValueAssets =
    Number(baseTokenAmount) +
    basetokenBegin -
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - TRADE_FEE) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  const [isPending, setIsPending] = useState<boolean>(false)
  const { account } = useWeb3React()

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
      toastInfo(t('Closing Position...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, address, amount, loan, maxReturn, dataWorker],
        symbolName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your position was closed successfully'))
        history.push(`/singleAssets`)
      }
    } catch (error) {
      console.error('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
    } finally {
      setIsPending(false)
    }
  }

  const handleConfirm = async () => {
    const id = positionId
    const amount = 0
    const loan = 0
    const maxReturn = ethers.constants.MaxUint256
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder

    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy])

    console.log({
      symbolName,
      id,
      workerAddress,
      amount,
      loan,
      convertedPositionValue,
      withdrawMinimizeTradingAddress,
      minfarmtoken,
      maxReturn,
      dataWorker,
    })
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  return (
    <Page>
      <Box mx="auto">
        <img src="/images/ClosePositionSA.svg" alt="ClosePositionSA" width="48px" />
      </Box>
      <Text fontSize="36px" textTransform="capitalize" mx="auto" mt="-30px">
        {t('Close Position')}
      </Text>
      <Box mx="auto">
        <Container>
          <Section className="gray" mt="1rem" flexDirection="column">
            <Flex justifyContent="space-between" alignItems="center">
              <Text bold>{t('Position Value')}</Text>
              <Text fontSize="12px">
                {t('Balance')}:{' '}
                <span style={{ fontWeight: 700 }}>{`${formatDisplayedBalance(
                  userTokenBalance,
                  TokenInfo?.token?.decimalsDigits,
                )} ${TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}`}</span>
              </Text>
            </Flex>
            <AmountPanel mt="10px" isDark={isDark}>
              {baseTokenAmount ? (
                <Text bold fontSize="28px">
                  {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol} +{' '}
                  {Number(baseTokenAmount).toPrecision(4)} {tokenValueSymbol}
                </Text>
              ) : (
                <Skeleton height="16px" width="80px" />
              )}
            </AmountPanel>
          </Section>
          <Section className="gray" mt="1rem" flexDirection="column">
            <Flex flexDirection="column">
              <ArrowDownIcon mx="auto" />
              <Flex alignItems="center" justifyContent="space-between">
                <Text bold>{t('Receive (Estimated)')}</Text>
                {tooltipVisible && tooltip}
                <Text fontSize="12px">
                  {t('Balance')}:{' '}
                  <span style={{ fontWeight: 700 }}>{`${formatDisplayedBalance(
                    userTokenBalanceIb,
                    TokenInfo?.token?.decimalsDigits,
                  )} i${TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}`}</span>
                </Text>
              </Flex>
              <AmountPanel mt="10px" isDark={isDark}>
                {convertedPositionValue ? (
                  <Text bold fontSize="28px">
                    {convertedPositionValue.toFixed(3)} {tokenValueSymbol}
                  </Text>
                ) : (
                  <Skeleton height="16px" width="80px" />
                )}
              </AmountPanel>
            </Flex>
            <Flex justifyContent="space-between" mt="1rem">
              <Flex style={{ cursor: 'pointer' }} alignItems="center">
                <img src="/images/Cheveron.svg" alt="" />
                <Text fontWeight="bold" fontSize="16px" onClick={() => history.goBack()}>
                  {t('Back')}
                </Text>
              </Flex>
              <Button
                style={{ borderRadius: '14px', padding: 0 }}
                onClick={handleConfirm}
                width="160px"
                height="50px"
                disabled={!account || isPending}
                isLoading={isPending}
                endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
              >
                {isPending ? t('Closing Position') : t('Close Position')}
              </Button>
            </Flex>
          </Section>
        </Container>
      </Box>
      <Flex justifyContent="center">
        <Container>
          <Bubble justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Text bold>{symbolName}</Text>
              <Text color="#6F767E" fontSize="12px">
                #{positionId}
              </Text>
            </Flex>
            <Flex alignItems="center">
              <Box width={24} height={24}>
                <TokenPairImage primaryToken={tokenValue} secondaryToken={quoteTokenValue} width={24} height={24} />
              </Box>
              <Box ml="5px">
                <Text style={{ whiteSpace: 'nowrap' }} ml="5px" bold>
                  {lpSymbolName.toUpperCase().replace('WBNB', 'BNB')}
                </Text>
                <Text style={{ whiteSpace: 'nowrap' }} ml="5px" fontSize="12px" color="#6F767E">
                  {data?.farmData?.lpExchange}
                </Text>
              </Box>
            </Flex>
          </Bubble>
        </Container>
      </Flex>
    </Page>
  )
}

export default ClosePositionSA

const AmountPanel = styled(Box)<{ isDark?: boolean }>`
  background: ${({ isDark }) => (isDark ? '#111315' : '#F7F7F8')};
  border: 1px solid #c6c6c6;
  box-sizing: border-box;
  border-radius: 12px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
`
