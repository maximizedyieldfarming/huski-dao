import React from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useAuth from 'hooks/useAuth'
import {
  Box,
  Text,
  Flex,
  Input,
  useWalletModal,
  useMatchBreakpoints,
  InfoIcon,
} from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useCopyToClipboard from 'utils/copyToClipboard'
import { BIG_ZERO } from 'utils/config'
import { Container, InputContainer, StyledButton, Banner } from './styles'
import {
  ButtonMenuRounded,
  ButtonMenuSquared,
  CustomButtonMenuItemSquared,
  CustomButtonMenuItemRounded,
  ProgressBar,
} from './components'
import {
  USDCIcon,
  ETHIcon,
  USDTIcon,
  Nft,
  HuskiDaoToken,
  DaoVer,
  LaughingHuski,
  ClipboardIcon,
  Trophy,
  HuskiGoggles,
} from './assets'
import { NFT_SPONSORS_TARGET, FUNDING_AMOUNT_TARGET, FUNDING_PERIOD_TARGET } from './config'
import { useHover } from './helpers'

interface Props {
  data: Record<string, any>
}

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  padding: 8px;
  top: -38px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  background-color: #261f30;
  color: #ffffff;
  border-radius: 16px;
  width: 100px;
`
const StyledTooltip = styled(Container)<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? 'inline-block' : 'none')};
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  padding: 20px 15px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 412px;
    padding: 30px 21px;
    left: 0;
    transform: none;
  }
  ${Text} {
    font-size: 12px;
  }
  z-index: 10;
`
const CustomTooltip: React.FC<{ invitedByUser: string; invitationBonus: string; isHovering: boolean }> = ({
  invitationBonus,
  invitedByUser,
  isHovering,
}) => {
  const { isMobile } = useMatchBreakpoints()

  return (
    <StyledTooltip isTooltipDisplayed={isHovering}>
      <Flex justifyContent="space-between" p={isMobile ? '0 20px' : '0 50px'} alignItems="center">
        <Box>
          <Text textAlign="center" mb="17px">
            Invited
          </Text>
          <Text textAlign="center" fontSize="24px !important">
            {invitedByUser}
          </Text>
        </Box>
        <Box background="#3D3049" height="43px" width="1px" mx={isMobile ? '50px' : '0'} />
        <Box>
          <Text textAlign="center" mb="17px">
            Bonus (HUSKI)
          </Text>
          <Text textAlign="center" fontSize="24px !important">
            {invitationBonus}
          </Text>
        </Box>
      </Flex>
      <Box mt="27px">
        <Text mb="24px" pl="23px">
          Share the referral link with your friends, and you will receive bonus rewards based on their contribution
        </Text>
        <Box mb="15px">
          <Flex>
            <img src={Trophy} width="23px" height="23px" alt="prize trophy" />
            <Text>Top 10:</Text>
          </Flex>
          <Text pl="23px">
            An NFT as our Huski DAO Ambassador
            <br />
            Earn bonus reward by Airdrop(10% Bonus)
          </Text>
        </Box>
        <Box mb="15px">
          <Flex>
            <img src={Trophy} width="23px" height="23px" alt="prize trophy" />
            <Text>Top 100:</Text>
          </Flex>
          <Text pl="23px">Earn bonus reward by Airdrop(4% Bonus)</Text>
        </Box>
        <Box pl="23px">
          <Text>Others:</Text>
          <Text>Earn bonus reward by Airdrop(2% Bonus)</Text>
        </Box>
      </Box>
    </StyledTooltip>
  )
}

const MainContent: React.FC<Props> = ({ data }) => {
  const [selectedToken, setSelectedToken] = React.useState<string>('ETH')
  const [tokenButtonIndex, setTokenButtonIndex] = React.useState<number>(0)
  const [amountButtonIndex, setAmountButtonIndex] = React.useState<number>(null)
  const [amountInToken, setAmountInToken] = React.useState<string>()
  const { account } = useWeb3React()
  const { isMobile, isTablet } = useMatchBreakpoints()
  // const isSmallScreen = isMobile || isTablet

  const getSelectedTokenData = (
    token: string,
  ): { selTokenPrice: BigNumber; selTokenDecimalPlaces: number; selTokenIcon: React.ReactNode } => {
    const selToken = data.find((t) => t.name === token)
    const selTokenPrice = selToken ? new BigNumber(selToken.price).div(100000000) : BIG_ZERO
    const selTokenDecimalPlaces = selToken ? selToken?.token?.decimalsDigits : 18
    const selTokenIcon = (() => {
      if (selectedToken === 'ETH') {
        return <ETHIcon />
      }
      if (selectedToken === 'USDT') {
        return <USDTIcon />
      }
      return <USDCIcon />
    })()
    return { selTokenPrice, selTokenDecimalPlaces, selTokenIcon }
  }
  const { selTokenPrice, selTokenDecimalPlaces, selTokenIcon } = getSelectedTokenData(selectedToken)

  const convertUsdToToken = (amountInUSD: string): string => {
    return new BigNumber(amountInUSD).div(selTokenPrice).toFixed(selTokenDecimalPlaces, 1)
  }
  const convertTokenToUsd = (pAmountInToken: string): string => {
    return new BigNumber(pAmountInToken).times(selTokenPrice).toFixed(selTokenDecimalPlaces, 1)
  }

  const handleTokenButton = (index) => {
    if (index === 0) {
      setSelectedToken('ETH')
      setTokenButtonIndex(index)
      setAmountInToken('0')
      setAmountButtonIndex(null)
    } else if (index === 1) {
      setSelectedToken('USDT')
      setTokenButtonIndex(index)
      setAmountInToken('0')
      setAmountButtonIndex(null)
    } else if (index === 2) {
      setSelectedToken('USDC')
      setTokenButtonIndex(index)
      setAmountInToken('0')
      setAmountButtonIndex(null)
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
  const raisedAmount = 0 // to get from some API ???
  const raisedAmountString = raisedAmount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const sponsorsAmount = 0 // to get from some API ???
  const nftSponsorsRemaining = NFT_SPONSORS_TARGET - sponsorsAmount

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

  const referralLink = data[0].code ? `https://dao.huski.finance?code=${data?.[0]?.code}` : null
  const [showReferralLink, setShowReferralLink] = React.useState<boolean>(false)
  const handleGenerateReferralLink = () => {
    setShowReferralLink(true)
  }

  //  TODO: change values later // get from some API?
  const invitedByUser = 0
  const userInvitationBonus = 0

  const [buttonIsHovering, buttonHoverProps] = useHover()
  const [value, copy] = useCopyToClipboard()
  const [tooltipIsHovering, tooltipHoverProps] = useHover()
  const [isTooltipDisplayed, setIsTooltipDisplayed] = React.useState(false)
  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }

  const walletReady = () => {
    return (
      <Container mb="13px" p="33px 21px 19px" maxWidth="460px">
        <Flex>
          <LaughingHuski style={{ zIndex: 2, marginRight: '-5px', alignSelf: 'center' }} width="16px" />
          <HuskiGoggles style={{ zIndex: 1 }} width="36px" />
          <LaughingHuski style={{ zIndex: 2, marginLeft: '-8px', alignSelf: 'flex-end' }} width="16px" />
        </Flex>
        <Text fontSize="24px" fontWeight="800 !important" mb="25px" mt="16px">
          Support Huski DAO
        </Text>
        <ButtonMenuSquared onItemClick={handleTokenButton} activeIndex={tokenButtonIndex}>
          <CustomButtonMenuItemSquared startIcon={<ETHIcon />}>ETH</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared startIcon={<USDTIcon />}>USDT</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared startIcon={<USDCIcon />}>USDC</CustomButtonMenuItemSquared>
        </ButtonMenuSquared>
        <InputContainer my="25px">
          <Box>{selTokenIcon}</Box>
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
        {new BigNumber(convertTokenToUsd(amountInToken)).lt(1000) ? (
          <Text color="red !important" fontSize="12px">
            Minimum investment amount is $1,000 (One Thousand USD)
          </Text>
        ) : null}
        {new BigNumber(convertTokenToUsd(amountInToken)).gt(50000) ? (
          <Text color="red !important" fontSize="12px">
            You cannot invest more than $50,000 (Fifty Thousand USD)
          </Text>
        ) : null}
        <Box mx="auto" width="fit-content" mt="38px" mb="19px">
          <StyledButton
            filled
            disabled={
              new BigNumber(convertTokenToUsd(amountInToken)).lt(1000) ||
              amountInToken === undefined ||
              new BigNumber(convertTokenToUsd(amountInToken)).gt(50000)
            }
          >
            Approve &amp; Confirm
          </StyledButton>
        </Box>
        <Box width="100%">
          <Flex alignItems="center">
            <Text fontSize="12px" mr="5px">
              Referral Link:
            </Text>
            <span {...tooltipHoverProps} style={{ position: 'relative', cursor: 'pointer' }}>
              <InfoIcon color="#ffffff" width="12px" />
              <CustomTooltip
                isHovering={!!tooltipIsHovering}
                invitedByUser={invitedByUser.toString()}
                invitationBonus={userInvitationBonus.toString()}
              />
            </span>
          </Flex>
          <Flex>
            <Flex
              background="#261F30"
              borderRadius="8px"
              height="40px"
              alignItems="center"
              justifyContent="center"
              p="10px 10px"
              width="90%"
              maxWidth="333px"
              mr="7px"
            >
              {showReferralLink ? (
                <Text
                  onClick={() => copy(referralLink).then(displayTooltip)}
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                  fontSize="12px"
                  width="100%"
                >
                  {referralLink}
                </Text>
              ) : (
                <Text fontSize="14px">Share your link to earn bonus rewards</Text>
              )}
            </Flex>
            {showReferralLink ? (
              <>
                <button
                  type="button"
                  onClick={() => copy(referralLink).then(displayTooltip)}
                  style={{
                    background: 'none',
                    height: '40px',
                    boxShadow: 'none',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    margin: '0 auto',
                  }}
                >
                  <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied!</Tooltip>
                  <ClipboardIcon color="#ffffff" />
                </button>
              </>
            ) : (
              <StyledButton
                filled
                width="78px"
                height="40px"
                onClick={handleGenerateReferralLink}
                disabled={!referralLink}
              >
                <Text fontSize="12px">Generate</Text>
              </StyledButton>
            )}
          </Flex>
        </Box>
      </Container>
    )
  }
  const walletNotReady = () => {
    return (
      <Container mb="13px" p="33px 21px 19px" maxWidth="460px">
        <Flex>
          <LaughingHuski style={{ zIndex: 2, marginRight: '-5px', alignSelf: 'center' }} width="16px" />
          <HuskiGoggles style={{ zIndex: 1 }} width="36px" />
          <LaughingHuski style={{ zIndex: 2, marginLeft: '-8px', alignSelf: 'flex-end' }} width="16px" />
        </Flex>
        <Text fontSize="24px" fontWeight="800 !important" mb="25px" mt="16px">
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
    <Box>
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
        <Banner mx="auto" mb="32px" maxWidth="268px !important">
          <LaughingHuski width="37px" />
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
    </Box>
  )
}

export default MainContent
