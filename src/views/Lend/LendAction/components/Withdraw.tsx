import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import useToast from 'hooks/useToast'
import { getAddress } from 'utils/addressHelpers'
import { withdraw } from 'utils/vaultService'

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

const Withdraw = ({ balance, name, exchangeRate, account, tokenData, allowance }) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>()

  const handleAmountChange = (e) => {
    const { value } = e.target

    const finalValue = value > balance ? balance : value
    setAmount(finalValue)
  }

  const setAmountToMax = (e) => {
    setAmount(balance)
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(tokenData.token.address)
  const assetsReceived = (Number(amount) * exchangeRate)?.toPrecision(3)
  const handleConfirm = () => {
    toastInfo('Pending Transaction...', 'Please Wait!')
    withdraw(account, amount)
      .then((res) => {
        console.log({ res })
        if (res) {
          toastSuccess(t('Successful!'), t('Your withdrawal was successfull'))
        } else {
          toastError('Unsuccessfulll', 'Something went wrong with your withdrawal request. Please  try again')
        }
      })
      .catch((error: any) => {
        console.log('error', error)
        toastWarning(t('Error'), error.message)
      })
  }
  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} step="0.01" value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">Balance: {`${balance} ib${name}`}</Text>

          <MaxContainer>
            <Box>
              <Text>ib{name}</Text>
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
          <Text>{name}</Text>
        </Section>
      </Box>
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        <Button
          onClick={handleConfirm}
          disabled={!account || Number(balance) === 0 || Number(amount) === 0 || amount === undefined}
        >
          {t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Withdraw
