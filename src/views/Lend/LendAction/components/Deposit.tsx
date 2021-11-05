import React, { useState } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon } from '@pancakeswap/uikit'
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
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import { ReactComponent as ArrowDown } from '../../assets/arrowDown.svg'

interface DepositProps {
  balance: any
  name: any
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

const StyledArrowDown = styled(ArrowDown)`
  fill: ${({ theme }) => theme.colors.text};
  width: 20px;
  height: 13px;
  path {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 20px;
  }
`

const Deposit: React.FC<DepositProps> = ({ balance, name, allowance, exchangeRate, account, tokenData, tokenName }) => {
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
  const tokenAddress = getAddress(tokenData.TokenInfo.token.address)
  const {vaultAddress} = tokenData.TokenInfo
  const approveContract = useERC20(tokenAddress)
  const depositContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    toastInfo('Approving...', 'Please Wait!')
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
      toastInfo('Transaction Pending...', 'Please Wait!')
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
      toastError('Unsuccessful', 'Something went wrong your deposit request. Please try again...')
    } finally {
      setIsPending(false)
      setAmount(0)
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
            Number(balance) === 0 ||
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

export default Deposit
