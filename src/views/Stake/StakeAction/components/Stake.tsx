import { Box, Button, Flex, Text, AutoRenewIcon } from 'husky-uikit1.0'
import NumberInput from 'components/NumberInput'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getBalanceAmount, getDecimalAmount, formatNumber } from 'utils/formatBalance'
import { getAddress, getFairLaunchAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

const ButtonGroup = styled(Flex)`
  gap: 10px;
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

const Stake = ({ account, userTokenBalance, name, allowance, tokenData }) => {
  const { t } = useTranslation()

  const [amount, setAmount] = useState<number>()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)

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

  const setAmountToMax = (e) => {
    setAmount(userTokenBalance)
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  // const tokenAddress = getAddress(tokenData.token.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()
  const vaultIbAddress = getAddress(tokenData.vaultAddress)
  const approveContract = useERC20(vaultIbAddress)
  const fairLaunchAddress = getFairLaunchAddress()
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(fairLaunchAddress, ethers.constants.MaxUint256)
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

  const handleStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    toastInfo(t('Pending request...'), t('Please Wait!'))
    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'deposit',
        [account, tokenData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your stake was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessfulll'), t('Something went wrong your stake request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleStake(convertedStakeAmount)
  }

  return (
    <>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">{t('Amount')}</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} step="0.01" value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">
            {t('Available Balance:')} {formatDisplayedBalance(userTokenBalance, tokenData?.token?.decimalsDigits)}{' '}
            {name}
          </Text>
          <MaxContainer>
            <Box>
              <Text>{name}</Text>
            </Box>
            <Box>
              <Button variant="tertiary" scale="xs" onClick={setAmountToMax} disabled={Number(userTokenBalance) === 0}>
                {t('MAX')}
              </Button>
            </Box>
          </MaxContainer>
        </Box>
      </Flex>

      <ButtonGroup flexDirection="column">
        {Number(allowance) > 0 ? null : (
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
            !(Number(allowance) > 0) ||
            Number(amount) === 0 ||
            amount === undefined ||
            Number(userTokenBalance) === 0 ||
            isPending
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

export default Stake
