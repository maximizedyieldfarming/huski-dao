import React from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Box, Text, Flex, Input, useMatchBreakpoints, InfoIcon, useTooltip } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import { BIG_TEN, BIG_ZERO } from 'utils/config'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import { getBalanceAmount } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getAddress } from 'utils/addressHelpers'
import useTokenBalance, { useGetEthBalance } from 'hooks/useTokenBalance'
import { Address } from 'config/constants/types'
import {
  ButtonMenuRounded,
  ButtonMenuSquared,
  CustomButtonMenuItemSquared,
  CustomButtonMenuItemRounded,
  ProgressBar,
  Container,
  InputContainer,
  StyledButton,
  Banner,
  ConnectWalletButton,
  StyledLink,
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
import { FUNDING_AMOUNT_TARGET, FUNDING_PERIOD_TARGET, Links } from './config'
import { useHover, useCopyToClipboard } from './helpers'

interface Props {
  data: Record<string, any>[]
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
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  /**
   * pass the name of the current selected token or any other token
   * to get the information other functions need from tha token
   * more values can be added to the return object if needed
   *
   * @param {String} tokenName name of currently selected token
   * @returns {Object} necessary information about that token
   */
  const getSelectedTokenData = (
    tokenName: string,
  ): {
    selTokenPrice: BigNumber
    selTokenDecimalPlaces: number
    selTokenIcon: React.ReactNode
    selToken: Record<string, any>
    selTokenAddress: Address
  } => {
    const selToken = data.find((d) => d.name === tokenName)
    const selTokenPrice = selToken ? new BigNumber(selToken.price).div(100000000) : BIG_ZERO
    const selTokenDecimalPlaces = selToken ? selToken?.token?.decimalsDigits : 18
    const selTokenIcon = (() => {
      if (selectedToken === 'ETH') {
        return <ETHIcon width="27px" />
      }
      if (selectedToken === 'USDT') {
        return <USDTIcon width="27px" />
      }
      return <USDCIcon width="27px" />
    })()
    const selTokenAddress = selToken?.token?.address

    return { selTokenPrice, selTokenDecimalPlaces, selTokenIcon, selToken, selTokenAddress }
  }

  const { selTokenPrice, selTokenIcon, selToken, selTokenAddress, selTokenDecimalPlaces } =
    getSelectedTokenData(selectedToken)
  const tokenPriceDataNotLoaded = selTokenPrice.isZero() || selTokenPrice.isNaN() || !selTokenPrice

  const convertUsdToToken = (amountInUSD: string): BigNumber => {
    if (!amountInUSD || tokenPriceDataNotLoaded) {
      return BIG_ZERO
    }
    return new BigNumber(amountInUSD).div(selTokenPrice)
  }

  const convertTokenToUsd = (pAmountInToken: string): BigNumber => {
    if (!pAmountInToken || tokenPriceDataNotLoaded) {
      return BIG_ZERO
    }
    return new BigNumber(pAmountInToken).times(selTokenPrice)
  }
  console.log({ 'amount in usd': convertTokenToUsd(amountInToken).toFixed(0), amountInToken })

  const balance = getBalanceAmount(useTokenBalance(getAddress(selTokenAddress)).balance)

  const ethBalance = getBalanceAmount(useGetEthBalance().balance)
  console.log(ethBalance.toString(), selToken.name, 'addr', getAddress(selTokenAddress))

  const handleTokenButton = (index) => {
    if (index === 0) {
      setSelectedToken('ETH')
      setTokenButtonIndex(index)
      setAmountInToken('')
      setAmountButtonIndex(null)
    } else if (index === 1) {
      setSelectedToken('USDT')
      setTokenButtonIndex(index)
      setAmountInToken('')
      setAmountButtonIndex(null)
    } else if (index === 2) {
      setSelectedToken('USDC')
      setTokenButtonIndex(index)
      setAmountInToken('')
      setAmountButtonIndex(null)
    }
  }
  const handleAmountButton = (index) => {
    if (index === 0) {
      setAmountInToken(convertUsdToToken('1000').toString())
      setAmountButtonIndex(index)
    } else if (index === 1) {
      setAmountInToken(convertUsdToToken('10000').toString())
      setAmountButtonIndex(index)
    } else if (index === 2) {
      setAmountInToken(convertUsdToToken('50000').toString())
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

  const raisedAmount = convertTokenToUsd(data[0].raiseFund).div(BIG_TEN.pow(18))
  const raisedAmountString = raisedAmount.toNumber().toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(selToken?.token.address)
  const approveContract = useERC20(tokenAddress)
  const vaultAddress = getAddress(selToken?.vaultAddress)
  const depositContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    // setIsApproving(true)
    try {
      const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
        // setIsApproved(true)
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      // setIsApproving(false)
    }
  }

  const handleDeposit = async (depositAmount, name: string, roundID, inviterCode) => {
    const callOptions = {
      gasLimit: 380000,
    }
    const callOptionsETH = {
      gasLimit: 380000,
      value: depositAmount.toString(),
    }
    // setIsPending(true)

    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        depositContract,
        'deposit',
        [depositAmount.toString(), roundID, inviterCode],
        name === 'ETH' ? callOptionsETH : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      console.info('error', error)
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      // setIsPending(false)
    }
  }

  const handleConfirm = async () => {
    const { allowance, name, roundID, code } = selToken

    if (Number(allowance) === 0) {
      handleApprove()
    } else {
      const url = window.location.href
      const index = url.lastIndexOf('=')
      let inviterCode = code
      if (index !== -1) {
        inviterCode = url.substring(index + 1, url.length)
      }

      // const depositAmount = getDecimalAmount(new BigNumber(amountInToken), 18)
      //   .toString()
      //   .replace(/\.(.*?\d*)/g, '')

      const depositAmount = ethers.utils.parseEther(amountInToken)

      handleDeposit(depositAmount, name, roundID, inviterCode)
    }
  }

  const referralLink = data[0].code ? `https://dao.huski.finance?code=${data?.[0]?.code}` : null
  const [showReferralLink, setShowReferralLink] = React.useState<boolean>(false)
  const handleGenerateReferralLink = () => {
    setShowReferralLink(true)
  }

  /**
   * @todo get the number of new users invited by the current user
   */
  const invitedByUser = 0
  const userInvitationBonus = 0

  const [value, copy] = useCopyToClipboard()
  const [tooltipIsHovering, tooltipHoverProps] = useHover()
  const [isTooltipDisplayed, setIsTooltipDisplayed] = React.useState(false)
  function displayTooltip() {
    setIsTooltipDisplayed(true)
    setTimeout(() => {
      setIsTooltipDisplayed(false)
    }, 1000)
  }
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text fontSize="14px">Fundraising on ETH</Text>
      <Text fontSize="14px">Distribution on ETH</Text>
      <Text fontSize="14px">Claim HUSKI on BSC</Text>
    </>,
    { placement: 'bottom' },
  )
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(
    <>
      <Text fontSize="14px">
        Each person has only one chance to support, and the amount is limited between $1,000 and $50,000
      </Text>
    </>,
    { placement: 'bottom' },
  )

  const [isHoveringConfirm, confirmHoverProps] = useHover()

  const walletReady = () => {
    return (
      <Container mb="13px" p="33px 21px 19px" maxWidth="460px">
        <Flex>
          <LaughingHuski style={{ zIndex: 2, marginRight: '-5px', alignSelf: 'center' }} width="16px" />
          <HuskiGoggles style={{ zIndex: 1 }} width="36px" />
          <LaughingHuski style={{ zIndex: 2, marginLeft: '-8px', alignSelf: 'flex-end' }} width="16px" />
        </Flex>
        <Text textAlign="center" fontSize="24px" fontWeight="800 !important" mb="25px" mt="16px">
          Support Huski DAO
        </Text>
        <ButtonMenuSquared
          onItemClick={handleTokenButton}
          activeIndex={tokenButtonIndex}
          // disabled={data[0]?.investorStatus === true}
        >
          <CustomButtonMenuItemSquared startIcon={<ETHIcon />}>ETH</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared startIcon={<USDTIcon />}>USDT</CustomButtonMenuItemSquared>
          <CustomButtonMenuItemSquared startIcon={<USDCIcon />}>USDC</CustomButtonMenuItemSquared>
        </ButtonMenuSquared>

        <Box my="25px" width="100%">
          <Text ml="auto" fontSize="12px" textAlign="right" color="#8B8787 !important" fontFamily={`'Baloo Bhai 2'`}>
            Balance:{' '}
            <Text as="span" fontSize="14px" fontFamily={`'Baloo Bhai 2'`}>
              {`${
                selToken.name.toLowerCase() === 'eth'
                  ? ethBalance.toFixed(selTokenDecimalPlaces, 1)
                  : balance.toFixed(selTokenDecimalPlaces, 1)
              } ${selToken.name}`}
            </Text>
          </Text>
          <InputContainer>
            <Box>{selTokenIcon}</Box>
            <Input
              placeholder="0.00"
              value={amountInToken}
              onChange={handleInputChange}
              pattern="^[0-9]*[.,]?[0-9]{0,18}$"
              disabled={tokenPriceDataNotLoaded || data[0]?.investorStatus === true}
              style={{ fontSize: '18px' }}
            />
            <Text color="#00000082 !important" fontSize="14px" fontFamily={`'Baloo Bhai 2'`}>{`≈${Number(
              convertTokenToUsd(amountInToken || '0'),
            )?.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}USD`}</Text>
          </InputContainer>
        </Box>
        <ButtonMenuRounded
          onItemClick={handleAmountButton}
          activeIndex={amountButtonIndex}
          disabled={tokenPriceDataNotLoaded || data[0]?.investorStatus === true}
        >
          <CustomButtonMenuItemRounded>$1,000</CustomButtonMenuItemRounded>
          <CustomButtonMenuItemRounded>$10,000</CustomButtonMenuItemRounded>
          <CustomButtonMenuItemRounded>$50,000</CustomButtonMenuItemRounded>
        </ButtonMenuRounded>
        {amountInToken && new BigNumber(convertTokenToUsd(amountInToken).toFixed()).lt(1000) ? (
          <Text color="red !important" fontSize="12px" mt="10px">
            Minimum investment amount is $1,000 (One Thousand USD)
          </Text>
        ) : null}
        {amountInToken && new BigNumber(convertTokenToUsd(amountInToken).toFixed()).gt(50000) ? (
          <Text color="red !important" fontSize="12px" mt="10px">
            You cannot invest more than $50,000 (Fifty Thousand USD)
          </Text>
        ) : null}
        {data[0]?.investorStatus === true ? (
          <Text fontSize="12px" mt="10px">
            Thank you for your support.
            <br />
            Please claim rewards when campaign closes.
          </Text>
        ) : null}
        <Box mx="auto" width="fit-content" mt="38px" mb="19px">
          {data[0]?.investorStatus === true ? (
            <StyledLink
              to={Links.joinDao}
              onClick={(e) => e.preventDefault()} /* preventDefault bc this link is empty TODO: change later */
              {...confirmHoverProps}
              style={{ padding: '10px', cursor: 'not-allowed', opacity: isHoveringConfirm && '0.8' }}
            >
              {isHoveringConfirm ? `Coming Soon` : `Join our DAO`}
            </StyledLink>
          ) : (
            <StyledButton
              filled
              onClick={handleConfirm}
              disabled={
                new BigNumber(convertTokenToUsd(amountInToken).toFixed()).lt(1000) ||
                amountInToken === undefined ||
                new BigNumber(convertTokenToUsd(amountInToken).toFixed()).gt(50000)
              }
            >
              Approve &amp; Confirm
            </StyledButton>
          )}
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
        <Text textAlign="center" fontSize="24px" fontWeight="800 !important" mb="25px" mt="16px">
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
          <Flex alignItems="center" style={{ gap: '5px' }}>
            <Text fontSize="14px" textAlign="right">
              ERC - 20 (Ethereum)
            </Text>
            {tooltipVisible && tooltip}
            <span ref={targetRef}>
              <InfoIcon color="#ffffff" width="12px" />
            </span>
          </Flex>
        </Flex>
        <Flex width="100%" justifyContent="space-between" alignItems="center" mb="28px">
          <Text fontSize="14px" textAlign="left">
            Price:
          </Text>
          <Flex alignItems="center" style={{ gap: '5px' }}>
            <Text fontSize="14px" textAlign="right">
              2 HIDAO per $1000
            </Text>
            {tooltipVisible2 && tooltip2}
            <span ref={targetRef2}>
              <InfoIcon color="#ffffff" width="12px" />
            </span>
          </Flex>
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
            })}{' '}
            ~ $5,000,000
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
          <ConnectWalletButton />
        </Box>
      </Container>
    )
  }

  const getFirstContainer = () => {
    if (account) {
      return walletReady()
    }
    return walletNotReady()
  }

  return (
    <Box>
      {getFirstContainer()}

      <Container mb="13px" p="31px 21px 24px" maxWidth="460px">
        <Text fontSize="20px" fontWeight="800 !important" mb="27px" textAlign="center">
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
        {new BigNumber(convertTokenToUsd(amountInToken).toFixed(0)).gte(50000) ? (
          <Banner mt="15px" maxWidth="100% !important">
            <img src={Nft} alt="NFT Co-Branding Partnerships" style={{ maxWidth: '40px' }} />
            <Text fontSize="14px">NFT co-branded sponsors </Text>
          </Banner>
        ) : null}
      </Container>

      <Container p="40px 21px 30px" maxWidth="460px">
        <Text fontSize="20px" fontWeight="800 !important" mb="42px" textAlign="center">
          More rewards after Protocols Fair Launch
        </Text>
        <Banner mx="auto" mb="32px" maxWidth="268px !important">
          <LaughingHuski width="37px" />
          <Text fontSize="14px" ml="18px">
            {account ? convertTokenToUsd(amountInToken).toFixed(2) : null} HUSKI Token
          </Text>
        </Banner>
        <Box width="100%">
          <Flex justifyContent="space-between" alignItems="center" mb="8px">
            <Text fontSize="14px">{timeRemaining()}</Text>
            <Text fontSize="14px">
              {new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).times(100).toFixed(2, 1)}%
            </Text>
          </Flex>
          <ProgressBar currentProgress={new BigNumber(raisedAmount).div(FUNDING_AMOUNT_TARGET).times(100).toString()} />
          <Text
            fontSize="14px"
            textAlign="left"
            mt="9px"
          >{`${raisedAmountString} / ${FUNDING_AMOUNT_TARGET.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`}</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default MainContent
