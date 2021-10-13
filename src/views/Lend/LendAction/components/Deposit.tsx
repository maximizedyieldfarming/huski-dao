import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'

interface DepositProps {
  balance: any
  name: any
  allowance: any
  exchangeRate: any
  handleDeposit: any
  handleApprove: any
  handleConfirm: any
  account: any
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

const Deposit: React.FC<DepositProps> = ({
  balance,
  name,
  allowance,
  exchangeRate,
  handleDeposit,
  handleApprove,
  handleConfirm,
  account,
}) => {
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

  const assetsReceived = (Number(amount) / exchangeRate)?.toPrecision(3)

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <NumberInput placeholder="0.00" onChange={handleAmountChange} value={amount} />
        </Box>
        <Box>
          <Text fontWeight="bold">Balance: {`${balance} ${name}`}</Text>

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
        {allowance === '0' ? (
          <Button onClick={handleApprove}>Approve</Button>
        ) : (
          <Button
            onClick={handleDeposit}
            disabled={!account ? true : new BigNumber(amount).isGreaterThan(new BigNumber(balance).toNumber())}
          >
            {t('Deposit')}
          </Button>
        )}
        <Button onClick={handleConfirm} disabled={!account}>
          {t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Deposit
