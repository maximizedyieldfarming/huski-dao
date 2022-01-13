import React, { useState, useCallback } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled from 'styled-components'
import {
  useMatchBreakpoints,
  Flex,
  Text,
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Button,
  AutoRenewIcon,
} from '@huskifinance/huski-frontend-uikit'
import { useHuskiPrice } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch, useERC20 } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useToast from 'hooks/useToast'
import { getBalanceAmount, getDecimalAmount } from 'utils/formatBalance'
import { getAddress, getFairLaunchAddress } from 'utils/addressHelpers'
import NumberInput from 'components/NumberInput'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import useTokenBalance, { useStakedibTokenBalance, useTokenAllowance } from 'hooks/useTokenBalance'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import TotalVolumeCell from './Cells/TotalVolumeCell'
import MyPosCell from './Cells/MyPosCell'
import NameCell from './Cells/NameCell'
import TotalValueCell from './Cells/TotalValueCell'

const StyledActionPanel = styled(Flex)<{ expanded: boolean }>`
  .expandedArea {
    ::-webkit-scrollbar {
      height: 8px;
    }
    flex-direction: column;
    padding: 30px 20px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      align-items: center;
    }
    .titleContainer {
      flex: 1;
      padding-left: 12px;
      ${({ theme }) => theme.mediaQueries.sm} {
        padding-left: 32px;
      }
    }
  }
`
const StakeContainer = styled(Flex)`
  // &:not(:last-child) {
  //   margin-bottom: 1rem;
  // }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 1 0 10rem;
    // &:not(:last-child) {
    //   margin-bottom: none;
    // }
  }
`

const StyledButton = styled(Button)`
  background: ${({ disabled }) => (disabled ? '#FFFFFF' : '#7B3FE4')};
  border-radius: 10px;
  color: ${({ disabled }) => (!disabled ? 'white' : '#6F767E')};
  text-align: center;
  width: 5rem;
  height: 48px;
  border: ${({ disabled }) => (disabled ? '1px solid #EFEFEF' : 'none')};
`

const MaxContainer = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: center;
  }
  justify-content: space-between;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 6px;
  margin-top: 8px;
  ${Box} {
    padding: 0 5px;
  }
`
const StyledRow = styled.div<{ huski?: boolean; expanded?: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border-left: ${({ theme, huski }) => (huski ? `2px solid  ${theme.colors.secondary}` : 'unset')};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  > ${Flex}:first-child {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      padding: 23px 20px 23px 20px;
    }
  }
  // > ${Flex}:first-child {
  //   border-bottom: 2px solid ${({ theme, expanded }) => (expanded ? theme.colors.disabled : 'transparent')};
  // }
`

const MaxButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #dddfe0;
  // background: isDark ? '#272B30' : '#FFFFFF';
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`

const StakeRow = ({ tokenData }) => {
  const { account } = useWeb3React()
  const { isTablet, isMobile } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskiPrice()
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }
  const isSmallScreen = isMobile || isTablet
  const { totalToken, totalSupply, totalValueStaked } = tokenData
  const tokenName = tokenData?.symbol.replace('WBNB', 'BNB')
  const { isDark } = useTheme()
  const userTokenBalance = getBalanceAmount(useTokenBalance(getAddress(tokenData?.vaultAddress)).balance)
  const userStakedBalance = getBalanceAmount(new BigNumber(useStakedibTokenBalance(tokenData?.pid).balance))
  const reward = new BigNumber(tokenData?.userData?.earnings).div(DEFAULT_TOKEN_DECIMAL)
  // const userTokenBalanceIbStaked = getBalanceAmount(
  //   useTokenBalance(getAddress(tokenData?.token.address)).balance,
  // ).toJSON()
  // console.log(
  //   `userTokenBalanceIb ${tokenData?.token?.symbol}`,
  //   userTokenBalance,
  //   'userTokenBalanceIbStaked',
  //   userTokenBalanceIbStaked,
  // )

  const totalVolLocked = new BigNumber(totalValueStaked || 0)
    .times(tokenData?.token?.busdPrice || 0)
    .times(Number(totalToken) / Number(totalSupply) || 0)

  const { allowance: tokenAllowance } = useTokenAllowance(
    getAddress(tokenData?.token?.address),
    getAddress(tokenData.vaultAddress),
  )
  const allowance =
    Number(tokenData?.userData?.allowance) > 0 ? tokenData?.userData?.allowance : tokenAllowance.toString()

  // stake operations
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  // const tokenAddress = getAddress(tokenData.token.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()
  const vaultIbAddress = getAddress(tokenData.vaultAddress)
  const approveContract = useERC20(vaultIbAddress)
  const fairLaunchAddress = getFairLaunchAddress()
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isPendingUnstake, setIsPendingUnstake] = useState<boolean>(false)
  const [isPendingClaim, setIsPendingClaim] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [stakeAmount, setStakeAmount] = useState<string>()
  const handleStakeInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userTokenBalance) ? userTokenBalance.toString() : input
        setStakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setStakeAmount],
  )

  const setStakeAmountToMax = () => {
    setStakeAmount(userTokenBalance.toString())
  }

  const handleStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    toastInfo(t('Pending request...'), t('Please Wait!'))
    setIsPending(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'deposit',
        [account, tokenData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your stake was successful'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your request. Please try again...'))
      console.error('transaction failed', error)
    } finally {
      setIsPending(false)
      setStakeAmount('')
    }
  }

  const handleStakeConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), 18)
    handleStake(convertedStakeAmount)
  }

  // unstake operations
  const [unstakeAmount, setUnstakeAmount] = useState<string>()
  const handleUnstakeInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = new BigNumber(input).gt(userStakedBalance) ? userStakedBalance.toString() : input
        setUnstakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userStakedBalance, setUnstakeAmount],
  )

  const setUnstakeAmountToMax = () => {
    setUnstakeAmount(userStakedBalance.toString())
  }

  const handleUnStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    setIsPendingUnstake(true)
    try {
      const tx = await callWithGasPrice(
        claimContract,
        'withdraw',
        [account, tokenData.pid, convertedStakeAmount.toString()],
        callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your unstake was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your unstake request. Please try again...'))
      console.error('transaction failed', error)
    } finally {
      setIsPendingUnstake(false)
      setUnstakeAmount('')
    }
  }

  const handleUnstakeConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(unstakeAmount), 18)
    handleUnStake(convertedStakeAmount)
  }

  // claim operations
  const handleClaimConfirm = async () => {
    setIsPendingClaim(true)
    toastInfo(t('Pending request...'), t('Please Wait!'))
    try {
      const tx = await callWithGasPrice(claimContract, 'harvest', [tokenData.pid], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPendingClaim(false)
    }
  }

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(fairLaunchAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <StyledRow role="row" huski={tokenData?.symbol.toLowerCase() === 'shuski'} expanded={expanded}>
      <Flex onClick={toggleExpanded}>
        <NameCell token={tokenData} />
        <AprCell getApyData={getStakeApy(tokenData, huskyPrice)} />
        <MyPosCell staked={userStakedBalance} name={tokenName} />
        <TotalValueCell valueStaked={totalValueStaked} name={tokenName} />
        <TotalVolumeCell volumeLocked={totalVolLocked} name={tokenName} />
        {shouldRenderActionPanel ? <ChevronUpIcon mr="10px" /> : <ChevronDownIcon mr="10px" />}
      </Flex>
      <StyledActionPanel flexDirection="column" expanded={expanded}>
        {shouldRenderActionPanel ? (
          <>
            <Flex className="expandedArea" style={{ overflow: 'auto', borderTop: '2px solid #EFEFEF' }}>
              <StakeContainer flexDirection="column">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('I Want to Stake')}
                  </Text>
                  <Text>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#6F767E' }}>{t('Balance:')}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#1A1D1F' }}>
                      {formatDisplayedBalance(userTokenBalance, tokenData?.token?.decimalsDigits)} {tokenName}
                    </span>
                  </Text>
                </Flex>
                <MaxContainer flexDirection={isSmallScreen ? 'column' : 'row'}>
                  <NumberInput
                    placeholder="0.00"
                    onChange={handleStakeInput}
                    value={stakeAmount}
                    style={{
                      background: 'unset',
                      border: 'none',
                      padding: 0,
                      color: '#1A1D1F',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      paddingLeft: '20px',
                    }}
                  />
                  <Flex alignItems="center" justifyContent="space-between">
                    <Box>
                      <MaxButton
                        type="button"
                        style={{
                          background: isDark ? '#272B30' : '#FFFFFF',
                        }}
                        onClick={setStakeAmountToMax}
                        disabled={Number(userTokenBalance) === 0 || Number(allowance) === 0}
                      >
                        <Text fontSize="14px">{t('MAX')}</Text>
                      </MaxButton>
                    </Box>
                    {Number(allowance) !== 0 ? (
                      <StyledButton
                        onClick={handleStakeConfirm}
                        disabled={
                          !account ||
                          !(Number(allowance) > 0) ||
                          Number(stakeAmount) === 0 ||
                          stakeAmount === undefined ||
                          Number(userTokenBalance) === 0 ||
                          isPending
                        }
                        isLoading={isPending}
                        endIcon={isPending ? <AutoRenewIcon spin color="primary" /> : null}
                      >
                        {isPending ? t('Staking') : t('Stake')}
                      </StyledButton>
                    ) : (
                      <StyledButton
                        onClick={handleApprove}
                        disabled={!account || isPending}
                        isLoading={isApproving}
                        endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                      >
                        {isApproving ? t('Approving') : t('Approve')}
                      </StyledButton>
                    )}
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer
                flexDirection="column"
                mr={isSmallScreen ? '0' : '3rem'}
                ml={isSmallScreen ? '0' : '4rem'}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('I Want to Unstake')}
                  </Text>
                  <Text>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#6F767E' }}>{t('Balance:')}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#1A1D1F' }}>
                      {formatDisplayedBalance(userStakedBalance, tokenData?.token?.decimalsDigits)} {tokenName}
                    </span>
                  </Text>
                </Flex>
                <MaxContainer flexDirection={isSmallScreen ? 'column' : 'row'}>
                  <NumberInput
                    pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                    placeholder="0.00"
                    onChange={handleUnstakeInput}
                    value={unstakeAmount}
                    style={{
                      background: 'unset',
                      border: 'none',
                      padding: 0,
                      color: '#1A1D1F',
                      fontSize: '28px',
                      fontWeight: 'bold',
                      paddingLeft: '20px',
                    }}
                  />

                  <Flex alignItems="center" justifyContent="space-between">
                    <Box>
                      <MaxButton
                        type="button"
                        style={{
                          background: isDark ? '#272B30' : '#FFFFFF',
                        }}
                        onClick={setUnstakeAmountToMax}
                        disabled={Number(userStakedBalance) === 0}
                      >
                        <Text fontSize="14px">{t('MAX')}</Text>
                      </MaxButton>
                    </Box>
                    <StyledButton
                      onClick={handleUnstakeConfirm}
                      disabled={
                        !account ||
                        Number(unstakeAmount) === 0 ||
                        unstakeAmount === undefined ||
                        Number(userStakedBalance) === 0 ||
                        isPendingUnstake
                      }
                      isLoading={isPendingUnstake}
                      endIcon={isPendingUnstake ? <AutoRenewIcon spin color="primary" /> : null}
                    >
                      {isPendingUnstake ? t('Unstaking') : t('Unstake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer
                flexDirection="column"
                pl={isSmallScreen ? '0' : '3rem'}
                style={isSmallScreen ? null : { borderLeft: '2px solid #EFEFEF' }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('HUSKI Rewards')}
                  </Text>
                </Flex>
                <MaxContainer>
                  <Text color="textFarm" fontSize="28px" fontWeight="700" pl="20px">
                    {reward.gt(0) ? (reward.lt(0.01) ? reward.toFixed(4, 1) : reward.toFixed(2, 1)) : '0.00'}
                  </Text>
                  <Flex alignItems="center">
                    <StyledButton
                      disabled={!account || Number(reward) === 0 || isPendingClaim}
                      onClick={handleClaimConfirm}
                      scale="sm"
                      isLoading={isPendingClaim}
                      endIcon={isPendingClaim ? <AutoRenewIcon spin color="primary" /> : null}
                    >
                      {isPendingClaim ? t('Claiming') : t('Claim')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
            </Flex>
          </>
        ) : null}
      </StyledActionPanel>
    </StyledRow>
  )
}

export default StakeRow
