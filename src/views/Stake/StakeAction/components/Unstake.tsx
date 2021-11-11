import { Box, Button, Flex, Text, AutoRenewIcon } from '@pancakeswap/uikit'
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
  const [isPending, setIsPending] = useState<boolean>(false)
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

  const handleUnStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'withdraw',
        [account, tokenData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your unstake was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your unstake request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleUnStake(convertedStakeAmount)
  }

  const balanceBigNumber = new BigNumber(stakedBalance)
  let balanceNumer
  if (balanceBigNumber.lt(1)) {
    balanceNumer = balanceBigNumber.toNumber().toFixed(tokenData?.token?.decimalsDigits ? tokenData?.token?.decimalsDigits : 2)
  } else {
    balanceNumer = balanceBigNumber.toNumber().toFixed(tokenData?.token?.decimalsDigits ? tokenData?.token?.decimalsDigits : 2)
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
            {t('Staked Balance:')} {balanceNumer} {name}
          </Text>
          <MaxContainer>
            <Box>
              <Text>{name}</Text>
            </Box>
            <Box>
              <Button variant="tertiary" scale="xs" onClick={setAmountToMax} disabled={Number(stakedBalance) === 0}>
                {t('MAX')}
              </Button>
            </Box>
          </MaxContainer>
        </Box>
      </Flex>

      <ButtonGroup flexDirection="column">
        <Button
          onClick={handleConfirm}
          disabled={
            !account || Number(amount) === 0 || amount === undefined || Number(stakedBalance) === 0 || isPending
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

export default Unstake
