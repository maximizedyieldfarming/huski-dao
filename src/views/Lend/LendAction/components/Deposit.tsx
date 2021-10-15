import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getAddress } from 'utils/addressHelpers'
import { ethers, Contract } from 'ethers'
import { useCakeVaultContract, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { deposit, approve } from 'utils/vaultService'

interface DepositProps {
  balance: any
  name: any
  allowance: any
  exchangeRate: any
  account: any
  tokenData: any
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

const Deposit: React.FC<DepositProps> = ({ balance, name, allowance, exchangeRate, account, tokenData }) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>()

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

  console.log('allowance', allowance)
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  console.log('is approved?', isApproved)

  const handleApprove = async () => {
    toastInfo('Approving...', 'Please Wait!')
    try {
      const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
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

  const handleConfirm = () => {
    toastInfo('Pending Transaction...', 'Please Wait!')
    deposit(tokenAddress, amount)
      .then((res) => {
        console.log({ res })
        if (res) {
          toastSuccess(t('Successful!'), t('Your deposit was successfull'))
        } else {
          toastError('Unsuccessfulll', 'Something went wrong your deposit request. Please try again...')
        }
      })
      .then(() => setAmount(0))
      .catch((error: any) => {
        console.log('error', error)
        toastWarning(t('Error'), error.message)
      })
  }

  const assetsReceived = (Number(amount) / exchangeRate)?.toPrecision(3)
  console.log('balance in lendAction', balance)

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">Balance: {`${balance.toPrecision(4)} ${name}`}</Text>

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
      </Section>
      <Box>
        <Text textAlign="center">Assets Received</Text>
        <Section justifyContent="space-between">
          <Text>{assetsReceived !== 'NaN' ? assetsReceived : 0}</Text>
          <Text>ib{name}</Text>
        </Section>
      </Box>
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        {isApproved ? null : <Button onClick={handleApprove}>Approve</Button>}
        <Button
          onClick={handleConfirm}
          disabled={!account || !isApproved || Number(amount) === 0 || amount === undefined || Number(balance) === 0}
        >
          {t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Deposit
