import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'

const ButtonGroup = styled(Flex)`
  gap: 10px;
`
const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.card};
`

const Withdraw = ({ balance, name, exchangeRate, handleConfirm, account }) => {
  // FIX: for scroll-wheel changing input of number type
  // using this method the problem won't happen
  const numberInputRef = useRef([])
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault()
    const references = numberInputRef.current
    references.forEach((reference) => reference?.addEventListener('wheel', handleWheel))

    return () => {
      references.forEach((reference) => reference?.removeEventListener('wheel', handleWheel))
    }
  }, [])

  const { t } = useTranslation()
  const [amount, setAmount] = useState(0)

  const handleAmountChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0
    setAmount(value)
  }

  const setAmountToMax = (e) => {
    setAmount(parseFloat(balance))
  }

  return (
    <>
      <Section justifyContent="space-between">
        <Box>
          <Text fontWeight="bold">Amount</Text>
          <Input
            type="number"
            placeholder="0.00"
            onChange={handleAmountChange}
            step="0.01"
            value={amount}
            ref={(input) => numberInputRef.current.push(input)}
          />
        </Box>
        <Box>
          <Text fontWeight="bold">Balance: {`${balance} ib${name}`}</Text>

          <Flex>
            <Text>ib{name} | </Text>
            <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
              MAX
            </Button>
          </Flex>
        </Box>
      </Section>
      <Box>
        <Text textAlign="center">Assets Received</Text>
        <Section justifyContent="space-between">
          <Text>{`${(amount * exchangeRate).toPrecision(3)} ${name}`}</Text>
        </Section>
      </Box>
      {/*    {isDeposit ? <Deposit /> : <Withdraw />} */}
      <ButtonGroup flexDirection="column" justifySelf="flex-end" mt="20%">
        {/*      {isDeposit && (
              <Button as={Link} to={`/lend/deposit/${token}/approve`}>
                Approve
              </Button>
            )} */}
        {/* <Button onClick={handleConfirmClick} disabled={!account}>
              Claim
            </Button> */}

        <Button onClick={handleConfirm} disabled={!account}>
          {t('Confirm')}
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Withdraw
