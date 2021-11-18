import React, { useState, useCallback } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import useToast from 'hooks/useToast'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import { usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useVault } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'

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

const Withdraw = ({ tokenName, exchangeRate, account, tokenData, allowance }) => {
  usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number | string>()

  const setAmountToMax = () => {
    setAmount(userTokenBalanceIb)
  }

  const { toastError, toastSuccess, toastInfo } = useToast()
  const { vaultAddress } = tokenData.TokenInfo
  const withdrawContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const assetsReceived = new BigNumber(amount)
    .times(exchangeRate)
    .toFixed(tokenData?.TokenInfo?.token?.decimalsDigits, 1)
  const [isPending, setIsPending] = useState<boolean>(false)

  const userTokenBalanceIb = getBalanceAmount(tokenData?.userData?.tokenBalanceIB).isNaN()
    ? 0.0
    : getBalanceAmount(tokenData?.userData?.tokenBalanceIB).toJSON()
  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalanceIb) ? userTokenBalanceIb : input
        setAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalanceIb, setAmount],
  )

  const handleConfirm = () => {
    toastInfo(t('Pending Transaction...'), t('Please Wait!'))
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
          <Text fontWeight="bold">{t('Amount')}</Text>
          <NumberInput
            placeholder="0.00"
            onChange={handleAmountChange}
            step="0.01"
            value={amount}
            style={{ backgroundColor: 'transparent' }}
          />
        </Box>
        <Box>
          <Text fontWeight="bold">
            {t('Balance')}:{' '}
            {`${formatDisplayedBalance(userTokenBalanceIb, tokenData.TokenInfo?.token?.decimalsDigits)} ib${tokenName}`}
          </Text>

          <MaxContainer>
            <Box>
              <Text>ib{tokenName}</Text>
            </Box>
            <Box>
              <Button
                variant="tertiary"
                scale="xs"
                onClick={setAmountToMax}
                disabled={Number(userTokenBalanceIb) === 0}
              >
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
          <Text>{tokenName}</Text>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        <Button
          onClick={handleConfirm}
          disabled={
            !account ||
            Number(userTokenBalanceIb) === 0 ||
            Number(amount) === 0 ||
            amount === undefined ||
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

export default Withdraw
