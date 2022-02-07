import React from 'react'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import {
  Box,
  Text,
  Flex,
  Input,
  LogoIcon,
  useWalletModal,
  useMatchBreakpoints,
} from '@huskifinance/huski-frontend-uikit'
import { Container, InputContainer, StyledButton, Banner } from './styles'
import {
  ButtonMenuRounded,
  ButtonMenuSquared,
  CustomButtonMenuItemSquared,
  CustomButtonMenuItemRounded,
  ProgressBar,
} from './components'
import { USDCIcon, ETHIcon, USDTIcon, Nft, HuskiDaoToken, DaoVer, LaughingHuski } from './assets'
import { NFT_SPONSORS_TARGET, FUNDING_AMOUNT_TARGET, FUNDING_PERIOD_TARGET } from './config'
import { useHover } from './helpers'

const MainContent = () => {
  const [selectedToken, setSelectedToken] = React.useState<string>('ETH')
  const [tokenButtonIndex, setTokenButtonIndex] = React.useState<number>(0)
  const [amountButtonIndex, setAmountButtonIndex] = React.useState<number>(null)
  const [amountInToken, setAmountInToken] = React.useState<string>()
  const { account } = useWeb3React()
  const { isMobile, isTablet } = useMatchBreakpoints()

  // const isSmallScreen = isMobile || isTablet
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
  const [buttonIsHovering, buttonHoverProps] = useHover()
  const walletReady = () => {
    return (
      <Container mb="13px" p="14px 21px 29px" maxWidth="460px">
        <Box>
          <img src={LaughingHuski} alt="" style={{ zIndex: 2 }} />
          <img src={LaughingHuski} alt="" style={{ zIndex: 1 }} />
          <img src={LaughingHuski} alt="" style={{ zIndex: 2 }} />
        </Box>
        <Text fontSize="24px" fontWeight="800 !important" mt="87px">
          Support Huski DAO
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
          <Text color="#00000082 !important">{`≈${Number(convertTokenToUsd(amountInToken || '0'))?.toLocaleString(
            'en-US',
            {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            },
          )}USD`}</Text>
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
          <StyledButton
            filled
            disabled={Number(convertTokenToUsd(amountInToken)) < 1000 || amountInToken === undefined}
          >
            Approve &amp; Confirm
          </StyledButton>
        </Box>
        <Box width="100%">
          <Text fontSize="12px">Referral Link:</Text>
          <Text as={Link} to="#" style={{ textDecoration: 'underline', cursor: 'pointer' }} fontSize="12px">
            https://dao.huski.finance?code=example%code%1234567{/* TODO: change later */}
          </Text>
        </Box>
      </Container>
    )
  }
  const walletNotReady = () => {
    return (
      <Container mb="13px" p="87px 21px 19px" maxWidth="460px">
        <Flex>
          <img
            src={LaughingHuski}
            alt=""
            style={{ zIndex: 2, marginRight: '-10px', height: '20px', alignSelf: 'center' }}
            width="20px"
          />
          <img src={LaughingHuski} alt="" style={{ zIndex: 1 }} width="50px" />
          <img
            src={LaughingHuski}
            alt=""
            style={{ zIndex: 2, marginLeft: '-10px', height: '20px', alignSelf: 'flex-end' }}
            width="20px"
          />
        </Flex>
        <Text fontSize="24px" fontWeight="800 !important" mb="25px">
          Support Huski DAO
        </Text>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Token:
          </Text>
          <Text fontSize="14px" textAlign="right">
            Huski DAO (HIDAO)
          </Text>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Type:
          </Text>
          <Text fontSize="14px" textAlign="right">
            ERC - 20 (Ethereum)
          </Text>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Price:
          </Text>
          <Text fontSize="14px" textAlign="right">
            2 HIDAO per $1000
          </Text>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Goal:
          </Text>
          <Text fontSize="14px" textAlign="right">
            {FUNDING_AMOUNT_TARGET.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Distribution：
          </Text>
          <Text fontSize="14px" textAlign="right">
            Claim on HuskiDAO Landing Page
          </Text>
        </Flex>
        <Flex width="100%" justifyContent="space-between" mb="28px" alignItems="center">
          <Text fontSize="14px" textAlign="left">
            Accepted Payments:
          </Text>
          <Flex flexWrap="wrap" alignItems="center" justifyContent="space-between" maxWidth={230} width="100%">
            <Flex alignItems="center">
              <ETHIcon width="24px" height="24px" />
              <Text fontSize="14px" ml="5px">
                ETH
              </Text>
            </Flex>
            <Flex alignItems="center">
              <USDTIcon width="24px" height="24px" />
              <Text fontSize="14px" ml="5px">
                USDT
              </Text>
            </Flex>
            <Flex alignItems="center">
              <USDCIcon width="24px" height="24px" />
              <Text fontSize="14px" ml="5px">
                USDC
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center">
          <Text fontSize="14px" textAlign="left">
            Deadline:
          </Text>
          <Text fontSize="14px" textAlign="right">
            March 31, 2022 (UTC)
          </Text>
        </Flex>

        <Box mx="auto" width="fit-content" mt="23px">
          {/*  <StyledButton onClick={onPresentConnectModal} heigth="36px">
            Connect Wallet
          </StyledButton> */}
          <Box
            ml="8px"
            borderRadius="14px"
            background="linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)"
            p="1px"
            height="46px"
          >
            <StyledButton
              onClick={(e) => e.preventDefault()}
              maxWidth={146}
              height="100%"
              {...buttonHoverProps}
              style={{ cursor: 'not-allowed' }}
            >
              <Text fontWeight={700} style={{ whiteSpace: 'nowrap' }}>
                {buttonIsHovering ? 'Coming Soon' : 'Connect Wallet'}
              </Text>
            </StyledButton>
          </Box>
        </Box>
      </Container>
    )
  }
  // using this function because theres a third condition, so its easier to read like this
  // insted of using ternary inside jsx
  const getFirstContainer = () => {
    if (account) {
      return walletReady()
    }
    return walletNotReady()
  }

  const { login, logout } = useAuth()
  const hasProvider: boolean = !!window.ethereum || !!window.BinanceChain
  const { onPresentConnectModal } = useWalletModal(login, logout, hasProvider)

  return (
    <>
      {getFirstContainer()}

      <Container mb="13px" p="31px 21px 24px" maxWidth="460px">
        <Text fontSize="20px" fontWeight="800 !important" mb="27px">
          You will receive
        </Text>
        <Flex flexDirection={isMobile ? 'column' : 'row'} width="100%">
          <Banner mr={isMobile ? '0' : '15px'} mb={isMobile ? '15px' : '0'}>
            <img src={HuskiDaoToken} alt="Huski DAO Token" style={{ maxWidth: '35px' }} />
            <Text fontSize="14px">Huski DAO Token</Text>
          </Banner>
          <Banner>
            <img src={DaoVer} alt="DAO Verification" style={{ maxWidth: '37px' }} />
            <Text fontSize="14px">DAO Verification</Text>
          </Banner>
        </Flex>
        {new BigNumber(convertTokenToUsd(amountInToken)).gte(50000) ? (
          <Banner mt="15px" maxWidth="100% !important">
            <img src={Nft} alt="NFT Co-Branding Partnerships" style={{ maxWidth: '40px' }} />
            <Text fontSize="14px">NFT co-branded sponsors </Text>
          </Banner>
        ) : null}
      </Container>

      <Container p="40px 21px 30px" maxWidth="460px">
        <Text fontSize="20px" fontWeight="800 !important" mb="42px">
          More rewards after Protocols Fair Launch
        </Text>
        {/* TODO: add tooltip */}
        <Banner mx="auto" mb="32px" maxWidth="268px !important">
          <img src={LaughingHuski} alt="Huski Token" width="37px" />
          {/*           <Box background="#fff" p="1px" borderRadius="100%" width="37px" maxHeight="37px" mr="18px">
            <LogoIcon width="100%" />
          </Box> */}
          <Text fontSize="14px" ml="18px">
            {convertTokenToUsd(amountInToken || '0')} HUSKI Token
          </Text>
        </Banner>
        <Box width="100%">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Text fontSize="14px">{timeRemaining()}</Text>
            <Text fontSize="14px">{new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).toString()}%</Text>
          </Flex>
          <ProgressBar currentProgress={new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).toString()} />
          <Flex justifyContent="space-between" alignItems="center" mt="9px">
            <Text fontSize="14px" textAlign="left">{`${raisedAmountString} / ${FUNDING_AMOUNT_TARGET.toLocaleString(
              'en-US',
              {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              },
            )}`}</Text>
            <Text fontSize="12px" textAlign="right">{`${nftSponsorsRemaining} NFT co-branded sponsors left`}</Text>
          </Flex>
        </Box>
      </Container>
    </>
  )
}

export default MainContent

// TODO: replace empty links
