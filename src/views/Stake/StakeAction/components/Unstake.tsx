import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import NumberInput from 'components/NumberInput'
import React, { useState, useRef, useEffect } from 'react'
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
  const [amount, setAmount] = useState<number>()

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
        <Button disabled={!account || Number(amount) === 0 || amount === undefined || Number(stakedBalance) === 0}>
          Confirm
        </Button>
      </ButtonGroup>
    </>
  )
}

export default Unstake
