import React, { useState, useCallback } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import { usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

interface DepositProps {
  allowance: any
  exchangeRate: any
  account: any
  tokenData: any
  tokenName: string
}

const ButtonGroup = styled(Flex)`
  gap: 10px;
`
const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.card};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  ${Box} {
    padding: 0 5px;
    &:first-child {
      border-right: 2px solid ${({ theme }) => theme.colors.text};
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

const Deposit: React.FC<DepositProps> = ({ allowance, exchangeRate, account, tokenData, tokenName }) => {
  usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number | string>()

  const setAmountToMax = () => {
    setAmount(userTokenBalance)
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

  const { balance: tokenBalance } = useTokenBalance(getAddress(tokenData.TokenInfo.token.address))
  const { balance: bnbBalance } = useGetBnbBalance()

  const userTokenBalance = getBalanceAmount(tokenName.toLowerCase() === 'bnb' ? bnbBalance : tokenBalance).toJSON()

  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
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
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleDeposit(convertedStakeAmount)
  }

  const assetsReceived = new BigNumber(amount).div(exchangeRate).toFixed(tokenData?.TokenInfo?.token?.decimalsDigits, 1)

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">{t('Amount')}</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">
            {t('Balance')}:{' '}
            {`${formatDisplayedBalance(userTokenBalance, tokenData.TokenInfo?.token?.decimalsDigits)} ${tokenName}`}
          </Text>

          <MaxContainer>
            <Box>
              <Text>{tokenName}</Text>
            </Box>
            <Box>
              <Button variant="tertiary" scale="xs" onClick={setAmountToMax} disabled={Number(userTokenBalance) === 0}>
                {t('MAX')}
              </Button>
            </Box>
          </MaxContainer>
        </Box>
      </Section>
      <Flex flexDirection="column">
        <StyledArrowDown style={{ margin: '0 auto' }} />
        <Text textAlign="center">{t('Assets Received')}</Text>
        <Section justifyContent="space-between">
          <Text>{assetsReceived !== 'NaN' ? assetsReceived : 0}</Text>
          <Text>ib{tokenName}</Text>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        {isApproved ? null : (
          <Button
            onClick={handleApprove}
            disabled={!account || isApproving}
            isLoading={isApproving}
            endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Approving') : t('Approve')}
          </Button>
        )}
        <Button
          onClick={handleConfirm}
          disabled={
            !account ||
            !isApproved ||
            Number(amount) === 0 ||
            amount === undefined ||
            Number(userTokenBalance) === 0 ||
            isPending ||
            exchangeRate.isNaN()
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Deposit
