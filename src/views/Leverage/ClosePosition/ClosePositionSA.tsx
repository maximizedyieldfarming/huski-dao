import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { Box, Flex, Text, useTooltip, InfoIcon, Skeleton, Button, AutoRenewIcon } from 'husky-uikit1.0'
import useToast from 'hooks/useToast'
import { useVault } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { ethers } from 'ethers'
import { TokenPairImage } from 'components/TokenImage'
import { ArrowDownIcon } from 'assets'
import { useWeb3React } from '@web3-react/core'

interface LocationParams {
  data: any
}

const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  gap: 10px;
`

const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  width: 510px;
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
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const ClosePositionSA = () => {
  const { t } = useTranslation()
  const {
    state: { data },
  } = useLocation<LocationParams>()

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

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenVaultAddress = TokenInfo?.vaultAddress
  const quoteTokenVaultAddress = QuoteTokenInfo?.vaultAddress
  const vaultContract = useVault(tokenVaultAddress)
  const quoteTokenVaultContract = useVault(quoteTokenVaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

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
    (farmingtokenBegin * basetokenBegin) / (Number(farmTokenAmount) * (1 - 0.0025) + farmingtokenBegin)
  const convertedPositionValue = convertedPositionValueAssets - Number(debtValueNumber)

  const [isPending, setIsPending] = useState<boolean>(false)
  const {account} = useWeb3React()

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
      const tx = await callWithGasPrice(contract, 'work', [id, address, amount, loan, maxReturn, dataWorker], symbolName === 'BNB' ? callOptionsBNB : callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.info('receipt', receipt)
        toastSuccess(t('Successful!'), t('Your position was closed successfully'))
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
    const maxReturn = ethers.constants.MaxUint256;
    const minfarmtoken = (Number(convertedPositionValue) * 0.995).toString()
    const abiCoder = ethers.utils.defaultAbiCoder;

    const dataStrategy = abiCoder.encode(['uint256'], [ethers.utils.parseEther(minfarmtoken)]);
    const dataWorker = abiCoder.encode(['address', 'bytes'], [withdrawMinimizeTradingAddress, dataStrategy]);

    console.log({symbolName, id, workerAddress, amount, loan,convertedPositionValue,withdrawMinimizeTradingAddress, minfarmtoken, maxReturn, dataWorker})
    handleFarm(id, workerAddress, amount, loan, maxReturn, dataWorker)
  }

  return (
    <Page>
      <Text fontSize="36px" textTransform="capitalize" mx="auto">
        {t('Close Position')}
      </Text>
      <Box mx="auto">
        <Flex alignItems="center" justifyContent="flex-end">
          <Bubble alignSelf="flex-end" alignItems="center">
            <Text>{symbolName}</Text>
            <Text>#{positionId}</Text>
            <Flex alignItems="center">
              <Box width={40} height={40}>
                <TokenPairImage
                  primaryToken={quoteTokenValue}
                  secondaryToken={tokenValue}
                  width={40}
                  height={40}
                  variant="inverted"
                />
              </Box>
              <Text style={{ whiteSpace: 'nowrap' }} ml="5px">
                {lpSymbolName.replace(' PancakeswapWorker', '').toUpperCase().replace("WBNB", "BNB")}
              </Text>
            </Flex>
          </Bubble>
        </Flex>
        <Container mt="2rem">
          <Section className="gray" mt="1rem" justifyContent="space-between">
            <Text>{t('Position Value')}</Text>
            {baseTokenAmount ? (
              <Text>
                {Number(farmTokenAmount).toPrecision(4)} {quoteTokenValueSymbol} +{' '}
                {Number(baseTokenAmount).toPrecision(4)} {tokenValueSymbol}
              </Text>
            ) : (
              <Skeleton height="16px" width="80px" />
            )}
          </Section>
          <Flex flexDirection="column" alignItems="center">
            <ArrowDownIcon mx="auto" />
            <Flex alignItems="center">
              <Text mx="auto">{t('Assets Received')}</Text>
              {tooltipVisible && tooltip}
              <span ref={targetRef}>
                <InfoIcon ml="5px" />
              </span>
            </Flex>
          </Flex>
          <Section className="gray" mt="1rem" justifyContent="center">
            {convertedPositionValue ? (
              <Text>
                {convertedPositionValue.toFixed(3)} {tokenValueSymbol}
              </Text>
            ) : (
              <Skeleton height="16px" width="80px" />
            )}
          </Section>
        </Container>
      </Box>
     <Button
            onClick={handleConfirm}
            width="300px"
            height="60px"
            disabled={!account || isPending}
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
          >
            {isPending ? t('Closing Position') : t('Close Position')}
          </Button>
    </Page>
  )
}

export default ClosePositionSA
