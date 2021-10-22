import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import NumberInput from 'components/NumberInput'
import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getDecimalAmount } from 'utils/formatBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import styled from 'styled-components'

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

const Unstake = ({ account, stakedBalance, name, allowance, tokenData }) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>()
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()
  const { toastError, toastSuccess } = useToast()
  const handleAmountChange = (e) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(e.key)) {
      e.preventDefault()
    }
    const { value } = e.target

    const finalValue = value > stakedBalance ? stakedBalance : value
    setAmount(finalValue)
  }

  const setAmountToMax = (e) => {
    setAmount(stakedBalance)
  }
  
  const callOptions = {
    gasLimit: 380000,
  }
console.info('tokenData',tokenData.pid)
  const handleUnStake = async (convertedStakeAmount: BigNumber) => {
    try {
      const tx = await callWithGasPrice(claimContract, 'withdraw', [account, tokenData.pid, convertedStakeAmount.toString()], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your unstake was successfull'))
      }
    } catch (error) {
      toastError('Unsuccessfulll', 'Something went wrong your unstake request. Please try again...')
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleUnStake(convertedStakeAmount)
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
            Staked Balance: {stakedBalance} {name}
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
        <Button onClick={handleConfirm} disabled={!account || Number(amount) === 0 || amount === undefined || Number(stakedBalance) === 0}>
          Confirm
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Unstake
