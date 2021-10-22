import React, { useState } from 'react'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getDecimalAmount } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { deposit, approve } from 'utils/vaultService'
import { ReactComponent as ArrowDown } from '../../assets/arrowDown.svg'

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

const StyledArrowDown = styled(ArrowDown)`
  fill: ${({ theme }) => theme.colors.text};
  width: 20px;
  height: 13px;
  path {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 20px;
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
  const depositContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)

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

  const callOptions = {
    gasLimit: 380000,
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    try {
      // .toString() being called to fix a BigNumber error in prod
      // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
      const tx = await callWithGasPrice(depositContract, 'deposit', [convertedStakeAmount.toString()], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      toastError('Unsuccessfulll', 'Something went wrong your deposit request. Please try again...')
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleDeposit(convertedStakeAmount)
  }

  const assetsReceived = (Number(amount) / exchangeRate)?.toPrecision(3)

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <NumberInput
            placeholder="0.00"
            onChange={handleAmountChange}
            value={amount}
            style={{ backgroundColor: 'transparent' }}
          />
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
      <Flex flexDirection="column">
        <StyledArrowDown style={{ margin: '0 auto' }} />
        <Text textAlign="center">Assets Received</Text>
        <Section justifyContent="space-between">
          <Text>{assetsReceived !== 'NaN' ? assetsReceived : 0}</Text>
          <Text>ib{name}</Text>
        </Section>
      </Flex>
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
