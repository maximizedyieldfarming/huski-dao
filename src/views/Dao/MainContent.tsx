import React from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Box, Text, Flex, Input, LogoIcon } from '@huskifinance/huski-frontend-uikit'
import { ButtonGroup, Container, InputContainer, StyledButton, ButtonGroupItem, Banner } from './styles'
import { HuskiDao, USDCIcon, ETHIcon } from './assets'
import { NFT_SPONSORS_TARGET, FUNDING_AMOUNT_TARGET, FUNDING_PERIOD_TARGET } from './config'

const MainContent = () => {
  const [selectedToken, setSelectedToken] = React.useState<string>('ETH')
  const [tokenButtonIndex, setTokenButtonIndex] = React.useState<number>(0)
  const [amountButtonIndex, setAmountButtonIndex] = React.useState<number>(null)
  const [amountInToken, setAmountInToken] = React.useState<string>('')

  const convertUsdToToken = (amountInUSD: string): string => {
    return new BigNumber(amountInUSD).times(0.01).toString() // TODO: change later with proper conversion rate, 0.01 is for testing purposes
  }
  const convertTokenToUsd = (pAmountInToken: string): string => {
    return new BigNumber(pAmountInToken).div(0.01).toString() // TODO: change later with proper conversion rate, 0.01 is for testing purposes
  }

  const handleTokenButton = (index) => {
    if (index === 0) {
      setSelectedToken('ETH')
      setTokenButtonIndex(index)
    } else if (index === 1) {
      setSelectedToken('USDT')
      setTokenButtonIndex(index)
    } else if (index === 2) {
      setSelectedToken('USDC')
      setTokenButtonIndex(index)
    }
  }
  const handleAmountButton = (index) => {
    if (index === 0) {
      setAmountInToken(convertUsdToToken('1000'))
      setAmountButtonIndex(index)
    } else if (index === 1) {
      setAmountInToken(convertUsdToToken('10000'))
      setAmountButtonIndex(index)
    } else if (index === 2) {
      setAmountInToken(convertUsdToToken('50000'))
      setAmountButtonIndex(index)
    }
  }
  const handleInputChange = (e) => {
    setAmountInToken(e.target.value)
  }

  const timeRemaining = () => {
    const now = new Date()
    const end = new Date(FUNDING_PERIOD_TARGET)
    const diff = end.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (days === 0 && hours !== 0) {
      return `Ends in ${hours} ${hours === 1 ? 'hour' : 'hours'}`
    }
    if (days === 0 && hours === 0 && minutes !== 0) {
      return `Ends in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
    }
    if (days === 0 && hours === 0 && minutes === 0) {
      return `Ends in ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
    }

    return `Ends in ${days} ${days === 1 ? 'day' : 'days'}`
  }
  const raisedAmount = (0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }) // to get from some API ???
  const sponsorsAmount = 0 // to get from some API ???
  const nftSponsorsRemaining = NFT_SPONSORS_TARGET - sponsorsAmount
  const getSelectedTokenIcon = () => {
    if (selectedToken === 'ETH') {
      return <ETHIcon />
    }
    /* if (selectedToken === 'USDT') {
      return <USDCIcon />
    } */
    return <USDCIcon />
  }

  return (
    <>
      <Container mb="13px" p="14px 21px 29px">
        <HuskiDao />
        <Text fontSize="24px" fontWeight={800}>
          Fund Huski DAO
        </Text>
        <ButtonGroup onItemClick={handleTokenButton} activeIndex={null} disabled={null}>
          <ButtonGroupItem>
            <ETHIcon style={{ marginRight: '5px' }} />
            <Text color="black">ETH</Text>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <Text>USDT</Text>
          </ButtonGroupItem>
          <ButtonGroupItem>
            <USDCIcon style={{ marginRight: '5px' }} />
            <Text color="black">USDC</Text>
          </ButtonGroupItem>
        </ButtonGroup>
        <InputContainer my="25px">
          <Box>{getSelectedTokenIcon()}</Box>
          <Input
            placeholder="0.00"
            value={amountInToken}
            onChange={handleInputChange}
            pattern="^[0-9]*[.,]?[0-9]{0,18}$"
          />
          <Text color="#00000082 !important" width="70px">{`≈${convertTokenToUsd(amountInToken || '0')}USD`}</Text>
        </InputContainer>
        <ButtonGroup onItemClick={handleAmountButton} activeIndex={null} disabled={null} amount>
          <ButtonGroupItem>$1,000</ButtonGroupItem>
          <ButtonGroupItem>$10,000</ButtonGroupItem>
          <ButtonGroupItem>$50,000</ButtonGroupItem>
        </ButtonGroup>
        <Box mx="auto" width="fit-content" mt="38px" mb="19px">
          <StyledButton filled>Confirm</StyledButton>
        </Box>
        <Flex justifyContent="center">
          <Text as={Link} to="#" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
            How to participate
          </Text>
        </Flex>
      </Container>

      <Container mb="13px" p="31px 21px 24px">
        <Text fontSize="20px" fontWeight={800}>
          You&apos;ll receive
        </Text>
        <Flex mb="15px">
          <Banner padding="12px 39px" flex="1 0 50%" mr="15px">
            <Box background="#fff" p="1px" borderRadius="100%" width="37px" height="37px" mr="18px">
              <LogoIcon width="100%" />
            </Box>
            <Text>Huski DAO</Text>
          </Banner>
          <Banner padding="12px 20px" flex="1 0 50%">
            <Box background="#fff" p="1px" borderRadius="100%" width="37px" height="37px" mr="18px">
              <LogoIcon width="100%" />
            </Box>
            <Text>DAO Verified Account</Text>
          </Banner>
        </Flex>
        {new BigNumber(convertTokenToUsd(amountInToken)).gte(50000) ? (
          <Banner padding="12px 90px" width="100% !important">
            <Box background="#fff" p="1px" borderRadius="100%" width="37px" height="37px" mr="18px">
              <LogoIcon width="100%" />
            </Box>
            <Text>NFT co-branded sponsors </Text>
          </Banner>
        ) : null}
      </Container>

      <Container p="40px 21px 30px">
        <Text fontSize="20px" fontWeight={800} mb="42px">
          More rewards after Protocols Fair Launch
        </Text>
        <Banner padding="12px 60px" mx="auto" mb="32px">
          <Box background="#fff" p="1px" borderRadius="100%" width="37px" height="37px" mr="18px">
            <LogoIcon width="100%" />
          </Box>
          <Text fontSize="14px">{convertTokenToUsd(amountInToken || '0')} HUSKI Token</Text>
        </Banner>
        <Box width="100%">
          <Text fontSize="14px">{timeRemaining()}</Text>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">{`${raisedAmount} / ${FUNDING_AMOUNT_TARGET.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}`}</Text>
            <Text fontSize="12px">{`${nftSponsorsRemaining} NFT co-branded sponsors left`}</Text>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default MainContent

// TODO: replace empty links
