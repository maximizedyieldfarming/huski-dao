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
} from '@pancakeswap/uikit'
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
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import NumberInput from 'components/NumberInput'
import DebtRatioProgress from 'components/DebRatioProgress'
import { useWeb3React } from '@web3-react/core'
import Select from 'components/Select/Select'
import { getHuskyRewards, getYieldFarming, getLeverageFarmingData, getBorrowingInterest } from '../helpers'

interface RouteParams {
  token: string
}

interface LocationParams {
  data?: any
  selected?: number
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
    state: { data, selected },
  } = useLocation<LocationParams>()

  const [selectedPool, setSelectedPool] = useState(selected)
  const singleFarm = data?.farmData[selectedPool]
  const poolName = singleFarm?.TokenInfo?.quoteToken.symbol.replace('wBNB', 'BNB')
  const baseName = singleFarm?.TokenInfo?.token.symbol.replace('wBNB', 'BNB')
  const allowance = singleFarm?.userData?.quoteTokenAllowance
  console.log('singleFarm-----', singleFarm)
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState(false)

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: tokenBalance } = useTokenBalance(getAddress(singleFarm?.TokenInfo?.quoteToken?.address))
  const userTokenBalance = Number(
    getBalanceAmount(singleFarm?.TokenInfo?.quoteToken?.symbol.toLowerCase() === 'wbnb' ? bnbBalance : tokenBalance),
  )
  console.log({ userTokenBalance, tokenBalance })
  const [tokenInput, setTokenInput] = useState(0)
  const [buttonIndex, setButtonIndex] = useState(null)
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
  const setTokenInputToFraction = (index) => {
    if (index === 0) {
      setTokenInput(userTokenBalance * 0.25)
      setButtonIndex(index)
    } else if (index === 1) {
      setTokenInput(userTokenBalance * 0.5)
      setButtonIndex(index)
    } else if (index === 2) {
      setTokenInput(userTokenBalance * 0.75)
      setButtonIndex(index)
    } else if (index === 3) {
      setTokenInput(userTokenBalance)
      setButtonIndex(index)
    }
  }

  const { vaultAddress } = singleFarm?.TokenInfo
  const tokenAddress = getAddress(singleFarm?.TokenInfo?.token?.address)
  const quoteTokenAddress = getAddress(singleFarm?.TokenInfo?.quoteToken?.address)
  const approveContract = useERC20(tokenAddress)
  const quoteTokenApproveContract = useERC20(quoteTokenAddress)
  const vaultContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const handleApprove = async () => {

    const contract = quoteTokenApproveContract//  approveContract 

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

  const handleFarm = async (contract, id, workerAddress, amount, loan, maxReturn, dataWorker) => {
    const callOptions = {
      gasLimit: 3800000,
    }
    // const callOptionsBNB = {
    //   gasLimit: 3800000,
    //   value: amount,
    // }

    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        contract,
        'work',
        [id, workerAddress, amount, loan, maxReturn, dataWorker],
        callOptions,
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
      // setTokenInput(0)
      // setQuoteTokenInput(0)
    }
  }

  const handleConfirm = async () => {
    const id = 0
    const AssetsBorrowed = farmData ? farmData[3] : 0
    const loan = getDecimalAmount(new BigNumber(AssetsBorrowed), 18).toString() // Assets Borrowed
    const maxReturn = 0
    const abiCoder = ethers.utils.defaultAbiCoder

    console.info('base + single + quote token input ')
    const farmingTokenAmount = Number(tokenInput).toString()
    const strategiesAddress = singleFarm?.TokenInfo.strategies.StrategyAddTwoSidesOptimal
    const dataStrategy = abiCoder.encode(['uint256', 'uint256'], [ethers.utils.parseEther(farmingTokenAmount), '1']) // [param.farmingTokenAmount, param.minLPAmount])
    const dataWorker = abiCoder.encode(['address', 'bytes'], [strategiesAddress, dataStrategy])
    const contract = vaultContract
    const amount = getDecimalAmount(new BigNumber(Number(tokenInput)), 18).toString()
    const workerAddress = singleFarm?.TokenInfo.address


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

  const huskyPrice = useHuskyPrice()
  const cakePrice = useCakePrice()
  const tokenName = singleFarm?.TokenInfo?.token?.symbol
  const huskyRewards = getHuskyRewards(singleFarm, huskyPrice, tokenName)
  const yieldFarmData = getYieldFarming(singleFarm, cakePrice)

  const { borrowingInterest } = getBorrowingInterest(singleFarm)
  console.log({ huskyRewards, yieldFarmData, borrowingInterest })
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

  const farmingData = getLeverageFarmingData(singleFarm, data?.singleLeverage, 0, tokenInput, tokenName)
  const farmData = farmingData ? farmingData[1] : []
  const apy = getApy(data?.singleLeverage)
  // const equity = null

  // const positionValue = farmData[8]
  // const huskiRewardsApr = huskyRewards * (data?.singleLeverage - 1)
  const selectOptions = []
  data.farmData?.forEach((item, index) => {
    selectOptions.push({
      label: item.lpSymbol.replace(' LP', ''),
      value: index,
    })
  })
  return (
    <Page>
      <Text bold fontSize="3" color="secondary" mx="auto">
        {t(`Farming ${poolName} Pools`)}
      </Text>
      <SectionWrapper>
        {/* graph goes here */}
        <Text>Graph here</Text>

        <Flex className="sideSection">
          <Section>
            <Box>
              <Flex>
                <Text>{t('Collateral')}</Text>
                <Select options={selectOptions} onChange={(option) => setSelectedPool(option.value)} />
              </Flex>
              <Box>
                <InputArea justifyContent="space-between" mb="1rem" background="backgroundAlt">
                  <BalanceInputWrapper alignItems="center" flex="1">
                    <NumberInput placeholder="0.00" value={tokenInput} onChange={handleTokenInput} />
                    <Flex alignItems="center">
                      <Box width={25} height={25} mr="5px">
                        <TokenImage token={singleFarm?.TokenInfo?.quoteToken} width={25} height={25} />
                      </Box>
                      <Text mr="5px" small color="textSubtle">
                        {t('Balance:')}
                      </Text>

                      <Text small color="textSubtle">
                        {userTokenBalance?.toPrecision(3)}
                      </Text>
                    </Flex>
                  </BalanceInputWrapper>
                </InputArea>
                <ButtonMenu onItemClick={setTokenInputToFraction} activeIndex={buttonIndex}>
                  <ButtonMenuItem>25%</ButtonMenuItem>
                  <ButtonMenuItem>50%</ButtonMenuItem>
                  <ButtonMenuItem>75%</ButtonMenuItem>
                  <ButtonMenuItem>100%</ButtonMenuItem>
                </ButtonMenu>
              </Box>
            </Box>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('APY')}</Text>
              <Text>{apy.toFixed(2)}%</Text>
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Debt Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[3]?.toFixed(2)} {baseName}
                </Text>
              ) : (
                <Text>0.00 {baseName}</Text>
              )}
            </Flex>
            <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('Position Value')}</Text>
              {farmData ? (
                <Text>
                  {farmData[8].toFixed(2)} {baseName} + {farmData[9].toFixed(2)} {poolName}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            {/* <Flex alignItems="center" justifyContent="space-between">
              <Text small>{t('HUSKI Rewards APR')}</Text>
              <Text>{huskiRewardsApr}</Text>
            </Flex> */}
          </Section>
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
                (Number(tokenInput) === 0 && Number(tokenInput) === 0) ||
                (tokenInput === undefined && tokenInput === undefined) ||
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
      </SectionWrapper>
    </Page>
  )
}

export default FarmSA
