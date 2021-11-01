import React, { useState } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import useToast from 'hooks/useToast'
import { getAddress } from 'utils/addressHelpers'
import { getDecimalAmount } from 'utils/formatBalance'
import { useVault } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { withdraw } from 'utils/vaultService'
import { ReactComponent as ArrowDown } from '../../assets/arrowDown.svg'

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
  const {vaultAddress} = tokenData.TokenInfo
  const withdrawContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const assetsReceived = (Number(amount) * exchangeRate)?.toPrecision(3)
  const [isPending, setIsPending] = useState<boolean>(false)

  const handleConfirm = () => {
    toastInfo('Pending Transaction...', 'Please Wait!')
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleWithdrawal(convertedStakeAmount)
  }

  const callOptions = {
    gasLimit: 380000,
  }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setIsPending(true)
    // .toString() being called to fix a BigNumber error in prod
    // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
    try {
      const tx = await callWithGasPrice(withdrawContract, 'withdraw', [convertedStakeAmount.toString()], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your withdraw was successfull'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <NumberInput
            placeholder="0.00"
            onChange={handleAmountChange}
            step="0.01"
            value={amount}
            style={{ backgroundColor: 'transparent' }}
          />
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
      <Flex flexDirection="column">
        <StyledArrowDown style={{ margin: '0 auto' }} />
        <Text textAlign="center">Assets Received</Text>
        <Section justifyContent="space-between">
          <Text>{assetsReceived !== 'NaN' ? assetsReceived : 0}</Text>
          <Text>{name}</Text>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        <Button
          onClick={handleConfirm}
          disabled={!account || Number(balance) === 0 || Number(amount) === 0 || amount === undefined || isPending}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Withdraw
