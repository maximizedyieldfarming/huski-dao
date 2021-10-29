import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import NumberInput from 'components/NumberInput'
import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'

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

const Stake = ({ account, balance, name, allowance, tokenData }) => {
  const { t } = useTranslation()

  const [amount, setAmount] = useState<number>()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)

  const handleAmountChange = (e) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(e.key)) {
      e.preventDefault()
    }
    const { value } = e.target

    const finalValue = value > balance ? balance : value
    setAmount(finalValue)
  }

  const setAmountToMax = (e) => {
    setAmount(balance)
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(tokenData.token.address)
  const vaultAddress = getAddress(tokenData.vaultAddress)
  const approveContract = useERC20(tokenAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()

  const handleApprove = async () => {
    toastInfo('Approving...', 'Please Wait!')
    try {
      const tx = await claimContract.approve(claimContract, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        console.log('receipt', receipt.status)
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        console.log('receipt', receipt.status)
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      console.log('error', error)
      toastWarning(t('Error'), error.message)
    }
  }

  const handleStake = async (convertedStakeAmount: BigNumber) => {

    const callOptions = {
      gasLimit: 380000,
    }

    try {
      const tx = await callWithGasPrice(
        claimContract,
        'deposit',
        [account, tokenData.pid, convertedStakeAmount.toString()],
        callOptions
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your stake was successfull'))
      }
    } catch (error) {
      toastError('Unsuccessfulll', 'Something went wrong your stake request. Please try again...')
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
          <Text fontWeight="bold">Amount</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} step="0.01" value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">
            Available Balance: {balance} {name}
          </Text>
          <MaxContainer>
            <Box>
              <Text>{name}</Text>
            </Box>
            <Box>
              <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
                MAX
              </Button>
            </Box>
          </MaxContainer>
        </Box>
      </Flex>

      <ButtonGroup flexDirection="column">
        {isApproved ? null : <Button onClick={handleApprove}>Approve</Button>}
        <Button
          onClick={handleConfirm}
          disabled={!account || !isApproved || Number(amount) === 0 || amount === undefined || Number(balance) === 0}
        >
          Confirm
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Stake
