import React from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import { Box, Text, Flex, Input, LogoIcon, useWalletModal } from '@huskifinance/huski-frontend-uikit'
import {
  ButtonMenuRounded,
  Container,
  InputContainer,
  StyledButton,
  Banner,
  ButtonMenuSquared,
  CustomButtonMenuItemSquared,
  CustomButtonMenuItemRounded,
  ProgressBar,
} from './styles'
import { HuskiDao, USDCIcon, ETHIcon, USDTIcon } from './assets'
import { NFT_SPONSORS_TARGET, FUNDING_AMOUNT_TARGET, FUNDING_PERIOD_TARGET } from './config'

const MainContent = () => {
  const [selectedToken, setSelectedToken] = React.useState<string>('ETH')
  const [tokenButtonIndex, setTokenButtonIndex] = React.useState<number>(0)
  const [amountButtonIndex, setAmountButtonIndex] = React.useState<number>(null)
  const [amountInToken, setAmountInToken] = React.useState<string>()
  const { account } = useWeb3React()
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
  // TODO: if input is less than $1,000 then not allow to confirm and show a warning
  // TODO: add referral link and a tooltip

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
  const raisedAmount = 0 // to get from some API ???
  const raisedAmountString = raisedAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const sponsorsAmount = 0 // to get from some API ???
  const nftSponsorsRemaining = NFT_SPONSORS_TARGET - sponsorsAmount
  const getSelectedTokenIcon = () => {
    if (selectedToken === 'ETH') {
      return <ETHIcon />
    }
    if (selectedToken === 'USDT') {
      return <USDTIcon />
    }
    return <USDCIcon />
  }

  // const { allowance: tokenAllowance } = useTokenAllowance(
  //   getAddress(tokenData?.TokenInfo?.token?.address),
  //   tokenData?.TokenInfo?.vaultAddress,
  // )

  // const handleApprove = async () => {
  //   toastInfo(t('Approving...'), t('Please Wait!'))
  //   setIsApproving(true)
  //   try {
  //     const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
  //     const receipt = await tx.wait()
  //     if (receipt.status) {
  //       toastSuccess(t('Approved!'), t('Your request has been approved'))
  //       setIsApproved(true)
  //     } else {
  //       toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
  //     }
  //   } catch (error: any) {
  //     toastWarning(t('Error'), error.message)
  //   } finally {
  //     setIsApproving(false)
  //   }
  // }

  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <>
      <Container mb="13px" p="14px 21px 29px">
        <HuskiDao />
        <Text fontSize="24px" fontWeight={800}>
          Fund Huski DAO
        </Text>
        <ButtonMenuSquared onItemClick={handleTokenButton} activeIndex={tokenButtonIndex}>
          <CustomButtonMenuItemSquared startIcon={<ETHIcon />}>ETH</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared>USDT</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared startIcon={<USDCIcon />}>USDC</CustomButtonMenuItemSquared>
        </ButtonMenuSquared>
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
        <ButtonMenuRounded onItemClick={handleAmountButton} activeIndex={amountButtonIndex}>
          <CustomButtonMenuItemRounded>$1,000</CustomButtonMenuItemRounded>
          <CustomButtonMenuItemRounded>$10,000</CustomButtonMenuItemRounded>
          <CustomButtonMenuItemRounded>$50,000</CustomButtonMenuItemRounded>
        </ButtonMenuRounded>
        {Number(convertTokenToUsd(amountInToken)) < 1000 ? (
          <Text color="red !important" fontSize="12px">
            Minimum investment amount is $1,000 (one thousand USD)
          </Text>
        ) : null}
        <Box mx="auto" width="fit-content" mt="38px" mb="19px">
          {!account ? (
            <StyledButton onClick={onPresentConnectModal} heigth="36px">
              Connect Wallet
            </StyledButton>
          ) : (
            <StyledButton
              filled
              disabled={Number(convertTokenToUsd(amountInToken)) < 1000 || amountInToken === undefined}
            >
              Approve &amp; Confirm
            </StyledButton>
          )}
        </Box>
        <Box width="100%">
          <Text fontSize="12px">Referral Link:</Text>
          <Text as={Link} to="#" style={{ textDecoration: 'underline', cursor: 'pointer' }} fontSize="12px">
            https://dao.huski.finance?code=example%code%1234567{/* TODO: change later */}
          </Text>
        </Box>
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
          <Flex justifyContent="space-between">
            <Text fontSize="14px">{timeRemaining()}</Text>
            <Text fontSize="14px">{new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).toString()}%</Text>
          </Flex>
          <ProgressBar currentProgress={new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).toString()} />
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">{`${raisedAmountString} / ${FUNDING_AMOUNT_TARGET.toLocaleString('en-US', {
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
