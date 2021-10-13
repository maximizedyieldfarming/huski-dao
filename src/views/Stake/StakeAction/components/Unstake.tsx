import { Box, Button, Flex, Input, Text } from '@pancakeswap/uikit'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const ButtonGroup = styled(Flex)`
  gap: 10px;
`

const Unstake = ({ account, balance, name }) => {
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

  const [amount, setAmount] = useState(0)

  const handleAmountChange = (e) => {
    const value = e.target.value ? parseFloat(e.target.value) : 0
    setAmount(value)
  }

  const setAmountToMax = (e) => {
    // setAmount(parseFloat(getFullDisplayBalance(balance, 18, 3)))
  }
  return (
    <>
      <Flex justifyContent="space-between">
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
          <Text fontWeight="bold">
            Balance: {balance} {name}
          </Text>
          <Flex>
            <Text>{name} | </Text>
            <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
              MAX
            </Button>
          </Flex>
        </Box>
      </Flex>

      <ButtonGroup flexDirection="column">
        <Button disabled={!account}>Claim</Button>
      </ButtonGroup>
    </>
  )
}

export default Unstake
