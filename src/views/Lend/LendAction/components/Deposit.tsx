import React, { useState, useCallback } from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  AutoRenewIcon,
  Grid,
  useMatchBreakpoints,
  Skeleton,
} from '@huskifinance/huski-frontend-uikit'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import useTheme from 'hooks/useTheme'
import { usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import { TokenImage } from 'components/TokenImage'
import Page from '../../../../components/Layout/Page'

interface DepositProps {
  name: any
  allowance: any
  exchangeRate: any
  account: any
  tokenData: any
  userTokenBalance: any
  userTokenBalanceIb: any
}

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items: center;
`
const Section = styled(Flex)`
  align-items: center;
  height: 100px;
  background-color: #f7f7f8;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.card};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  height: 100%;
  ${Box} {
    padding: 0 5px;
    &:first-child {
      // border-right: 2px solid ${({ theme }) => theme.colors.text};
    }
    &:last-child {
      // border-left: 1px solid purple;
    }
  }
`

const StyledArrowDown = styled(ArrowDownIcon)`
  fill: ${({ theme }) => theme.colors.text};
  width: 20px;
  height: 13px;
  path {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 20px;
  }
`

const Deposit: React.FC<DepositProps> = ({
  allowance,
  exchangeRate,
  account,
  tokenData,
  name,
  userTokenBalance,
  userTokenBalanceIb,
}) => {
  usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<string>()
  const history = useHistory()

  const setAmountToMax = () => {
    if (name.toLowerCase() === 'bnb') {
      setAmount(new BigNumber(userTokenBalance).toFixed(2, 1))
    } else {
      setAmount(userTokenBalance.toString())
    }
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(tokenData.TokenInfo.token.address)
  const { vaultAddress } = tokenData.TokenInfo
  const approveContract = useERC20(tokenAddress)
  const depositContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const isApproved: boolean = Number(allowance) > 0
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const { isDark } = useTheme()

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet
  // const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  // const { balance: bnbBalance } = useGetBnbBalance()

  // const userTokenBalance = getBalanceAmount(name.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance).toJSON()

  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setAmount],
  )

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
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

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }
    const callOptionsBNB = {
      gasLimit: 380000,
      value: convertedStakeAmount.toString(),
    }
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        depositContract,
        'deposit',
        [convertedStakeAmount.toString()],
        name === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount('')
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleDeposit(convertedStakeAmount)
  }
  const assetsReceived = new BigNumber(amount).div(exchangeRate).toFixed(tokenData?.TokenInfo?.token?.decimalsDigits, 1)

  return (
    <Page style={{ padding: 0 }}>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" color="textFarm" fontSize="14px">
            {t('From')}
          </Text>
          <Text color="textSubtle" fontSize="12px">
            {t('Balance')}:{' '}
            {userTokenBalance ? (
              <span style={{ color: isDark ? 'white' : '#1A1D1F', fontWeight: 700 }}>{`${formatDisplayedBalance(
                userTokenBalance,
                tokenData.TokenInfo?.token?.decimalsDigits,
              )} ${name}`}</span>
            ) : (
              <Skeleton width="80px" height="1rem" />
            )}
          </Text>
        </Flex>
        <Section
          justifyContent="space-between"
          style={{ background: isDark ? '#111315' : '#F7F7F8' }}
          flexDirection={isSmallScreen ? 'column' : 'row'}
        >
          <Box>
            <NumberInput
              pattern="^[0-9]*[.,]?[0-9]{0,18}$"
              placeholder="0.00"
              onChange={handleAmountChange}
              value={amount}
              style={{
                background: 'unset',
                border: 'transparent',
                padding: '0',
                color: '#1A1D1F  ',
                fontSize: '28px',
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Box>
            <MaxContainer>
              <Box>
                <button
                  type="button"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #DDDFE0',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '7px 8px',
                    color: '#1A1D1F',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                  onClick={setAmountToMax}
                >
                  <Text fontSize="16px" fontWeight="500" lineHeight="20px">{t('MAX')}</Text>
                </button>
              </Box>
              <Grid gridGap="5px" alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="40px 1fr">
                <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} />
                <Text color="textFarm" style={{ fontWeight: 700 }} width={40} ml="20px">
                  {name}
                </Text>
              </Grid>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <Flex flexDirection="column">
        <StyledArrowDown style={{ marginLeft: 'auto', marginRight: 'auto' }} />
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" color="textFarm" fontSize="14px">
            {t('Recieve (Estimated)')}
          </Text>
          <Text color="textSubtle" fontSize="12px">
            {t('Balance')}:{' '}
            {userTokenBalanceIb ? (
              <span style={{ color: isDark ? 'white' : '#1A1D1F', fontWeight: 700 }}>{`${formatDisplayedBalance(
                userTokenBalanceIb,
                tokenData.TokenInfo?.token?.decimalsDigits,
              )} ib${name}`}</span>
            ) : (
              <Skeleton width="80px" height="1rem" />
            )}
          </Text>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }}>
          <Box>
            <Text style={{ backgroundColor: 'transparent', fontSize: '28px', fontWeight: 700 }}>
              {assetsReceived !== 'NaN' ? assetsReceived : 0}
            </Text>
          </Box>
          <Box>
            <MaxContainer>
              <Grid gridGap="5px" alignItems="center" gridTemplateRows="1fr" gridTemplateColumns="40px 1fr">
                <TokenImage token={tokenData?.TokenInfo.token} width={40} height={40} />
                <Text color="textFarm" style={{ fontWeight: 700 }} width={40} ml="20px">
                  ib{name}
                </Text>
              </Grid>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="row" justifyContent="space-between" mb="20px" mt="30px">
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }}>
          <img src="/images/Cheveron.svg" alt="" />
          <Text color="textSubtle" fontWeight="bold" fontSize="16px" style={{ height: '100%' }} onClick={() => history.push('/lend')}>
            {t('Back')}
          </Text>
        </Flex>
        {/* {isApproved ? null : (
          <Button
            style={{ width: '160px', height: '57px', borderRadius: '16px' }}
            onClick={handleApprove}
            disabled
            isLoading={isApproving}
            endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Approving') : t('Approve')}
          </Button>
        )} */}
        <Flex flexWrap="wrap" justifyContent="right">
          {isApproved ? null : (
            <Button
              style={{
                width: '160px',
                height: '57px',
                borderRadius: '16px',
                marginBottom: '10px',
                marginRight: '10px',
              }}
              onClick={handleApprove}
              disabled={!account || isApproving}
              isLoading={isApproving}
              endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
            >
              {isApproving ? t('Approving') : t('Approve')}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            style={{ width: '160px', height: '57px', borderRadius: '16px' }}
            disabled={
              !account ||
              !isApproved ||
              Number(amount) === 0 ||
              amount === undefined ||
              Number(userTokenBalance) === 0 ||
              isPending
            }
            isLoading={isPending}
            endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Transfering') : t('Transfer')}
          </Button>
        </Flex>
      </ButtonGroup>
    </Page>
  )
}

export default Deposit

// NOTE: javascript Number function and BigNumber.js toNumber() function might return a different value than the actual value
// if that value is bigger than MAX_SAFE_INTEGER. so needs to be careful when doing number operations.
// https://stackoverflow.com/questions/35727608/why-does-number-return-wrong-values-with-very-large-integers
