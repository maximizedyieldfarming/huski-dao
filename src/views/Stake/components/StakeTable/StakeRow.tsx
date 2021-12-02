import React, { useState, useCallback } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled, { keyframes, css } from 'styled-components'
import {
  useMatchBreakpoints,
  Flex,
  Text,
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Button,
  Input,
  AutoRenewIcon,
} from 'husky-uikit1.0'
import { useHuskiPrice } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useClaimFairLaunch, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { getBalanceAmount, getDecimalAmount, formatNumber } from 'utils/formatBalance'
import { getAddress, getFairLaunchAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import useTokenBalance from 'hooks/useTokenBalance'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import ActionCell from './Cells/ActionCell'
import TotalVolumeCell from './Cells/TotalVolumeCell'
import MyPosCell from './Cells/MyPosCell'
import NameCell from './Cells/NameCell'
import RewardsCell from './Cells/RewardsCell'
// import ClaimCell from './Cells/'
import StakedCell from './Cells/StakedCell'
import TotalValueCell from './Cells/TotalValueCell'

const expandAnimation = keyframes`
  from {
    max-height: 20px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 20px;
  }
`

const StyledActionPanel = styled(Flex)<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  .expandedArea {
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
  flex: 1 0 460px;
`

interface Props {
  disabled: boolean
}
const StyledButton = styled(Button)<Props>`
  background: ${({ disabled }) => (disabled ? '#FFFFFF' : '#7B3FE4')};
  border-radius: 10px;
  color: ${({ disabled }) => (!disabled ? 'white' : '#6F767E')};
  text-align: center;
  width: 140px;
  height: 48px;
  border: ${({ disabled }) => (disabled ? '1px solid #EFEFEF' : 'none')};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 6px;
  ${Box} {
    padding: 0 5px;
    &:first-child {
      // border-right: 2px solid ${({ theme }) => theme.colors.text};
    }
    &:last-child {
      // border-left: 1px solid purple;
    }
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
    }
  }
  > ${Flex}:first-child {
    border-bottom: 2px solid ${({ theme, expanded }) => (expanded ? theme.colors.disabled : 'transparent')};
  }
`

const StakeRow = ({ tokenData }) => {
  const { account } = useWeb3React()
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskiPrice()
  console.log({ huskyPrice })
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { totalToken, totalSupply, vaultDebtVal, totalValueStaked } = tokenData
  // console.log('totaltoken', Number(totalToken), 'totalsupply', Number(totalSupply), 'vaultDebt', Number(vaultDebtVal))

  const userTokenBalance = getBalanceAmount(useTokenBalance(getAddress(tokenData?.vaultAddress)).balance).toJSON()
  const userStakedBalance = getBalanceAmount(new BigNumber(tokenData.userData.stakedBalance)).toJSON()
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
  // console.log('totalVolLocked', totalVolLocked.toJSON(), "totalVAluestaked", totalValueStaked)

  const allowance = tokenData?.userData?.allowance

  // stake operations
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  // const tokenAddress = getAddress(tokenData.token.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const claimContract = useClaimFairLaunch()
  const vaultIbAddress = getAddress(tokenData.vaultAddress)
  const approveContract = useERC20(vaultIbAddress)
  const fairLaunchAddress = getFairLaunchAddress()
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)
  const [stakeAmount, setStakeAmount] = useState<string>()
  const handleStakeInput = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalance) ? userTokenBalance : input
        setStakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalance, setStakeAmount],
  )

  const setStakeAmountToMax = () => {
    setStakeAmount(userTokenBalance)
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
        const finalValue = Number(input) > Number(userStakedBalance) ? userStakedBalance : input
        setUnstakeAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userStakedBalance, setUnstakeAmount],
  )

  const setUnstakeAmountToMax = () => {
    setUnstakeAmount(userStakedBalance)
  }

  const handleUnStake = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }

    setIsPending(true)
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
      setIsPending(false)
      setUnstakeAmount('')
    }
  }

  const handleUnstakeConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(unstakeAmount), 18)
    handleUnStake(convertedStakeAmount)
  }

  // claim operations
  const handleClaimConfirm = async () => {
    setIsPending(true)
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
      setIsPending(false)
    }
  }

  return (
    <StyledRow role="row" huski={tokenData?.symbol.toLowerCase() === 'shuski'} expanded={expanded}>
      <Flex onClick={toggleExpanded} mr="20px" ml="20px">
        <NameCell token={tokenData} />
        <AprCell getApyData={getStakeApy(tokenData, huskyPrice)} />
        <MyPosCell staked={userStakedBalance} />
        <TotalValueCell valueStaked={totalValueStaked} />
        <TotalVolumeCell volumeLocked={totalVolLocked} />
        {/* <ActionCell token={tokenData} /> */}
        {shouldRenderActionPanel ? <ChevronUpIcon mr="10px" /> : <ChevronDownIcon mr="10px" />}
      </Flex>
      <StyledActionPanel flexDirection="column" expanded={expanded}>
        {/* {shouldRenderActionPanel ? (
          <>
            <ChevronUpIcon mx="auto" />
            <Flex className="expandedArea">
              <Box className="titleContainer">
                <Text>{t('My Positions')}</Text>
              </Box>
              <StakedCell staked={userStakedBalance.toPrecision(4)} name={tokenData?.symbol} />
              <RewardsCell token={tokenData} />
              <ClaimCell token={tokenData} />
            </Flex>
          </>
        ) : (
          <ChevronDownIcon mx="auto" />
        )} */}
        {shouldRenderActionPanel ? (
          <>
            <Flex className="expandedArea">
              <StakeContainer flexDirection="column">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('I Want to stake')}
                  </Text>
                  <Text color="textSubtle" fontSize="12px">
                    {t('Available %tokenName% balance:', { tokenName: tokenData?.symbol })}
                    <span style={{ color: '#1A1D1F', fontSize: '12px', fontWeight: 700 }}>
                      {formatDisplayedBalance(userTokenBalance, tokenData?.token?.decimalsDigits)}
                    </span>
                  </Text>
                </Flex>
                <MaxContainer>
                  <Input
                    pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                    placeholder="0.00"
                    onChange={handleStakeInput}
                    value={stakeAmount}
                  />
                  <Flex alignItems="center">
                    <Box>
                      <button
                        type="button"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          border: '1px solid #DDDFE0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                        onClick={setStakeAmountToMax}
                        disabled={Number(userTokenBalance) === 0}
                      >
                        {t('MAX')}
                      </button>
                    </Box>
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
                      endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                    >
                      {isPending ? t('Confirming') : t('Stake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer flexDirection="column" mr="60px" ml="30px">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('I Want to Unstake')}
                  </Text>
                  <Text color="textSubtle" fontSize="12px">
                    {t('Staked %tokenName% balance:', { tokenName: tokenData?.symbol })}
                    <span style={{ color: '#1A1D1F', fontSize: '12px', fontWeight: 700 }}>
                      {formatDisplayedBalance(userStakedBalance, tokenData?.token?.decimalsDigits)}
                    </span>
                  </Text>
                </Flex>
                <MaxContainer>
                  <Input
                    pattern="^[0-9]*[.,]?[0-9]{0,18}$"
                    placeholder="0.00"
                    onChange={handleUnstakeInput}
                    value={unstakeAmount}
                  />

                  <Flex alignItems="center">
                    <Box>
                      <button
                        type="button"
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '8px',
                          border: '1px solid #DDDFE0',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                        }}
                        onClick={setUnstakeAmountToMax}
                        disabled={Number(userStakedBalance) === 0}
                      >
                        {t('MAX')}
                      </button>
                    </Box>
                    <StyledButton
                      onClick={handleUnstakeConfirm}
                      disabled={
                        !account ||
                        Number(unstakeAmount) === 0 ||
                        unstakeAmount === undefined ||
                        Number(userStakedBalance) === 0 ||
                        isPending
                      }
                      isLoading={isPending}
                      endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                    >
                      {isPending ? t('Confirming') : t('Unstake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer flexDirection="column" pl="60px" style={{ borderLeft: '2px solid #EFEFEF' }}>
                <Flex alignItems="center" justifyContent="space-between">
                  <Text color="text" fontSize="14px" fontWeight="700">
                    {t('HUSKI Rewards')}
                  </Text>
                </Flex>
                <MaxContainer>
                  <Text color="textFarm" fontSize="28px" fontWeight="700">
                    {reward.toFixed(2, 1)}
                  </Text>
                  <Flex alignItems="center">
                    <StyledButton
                      disabled={!account || Number(reward) === 0}
                      onClick={handleClaimConfirm}
                      scale="sm"
                      isLoading={isPending}
                      endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
                    >
                      {t('Claim')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
            </Flex>
          </>
        ) : (
          <div />
        )}
      </StyledActionPanel>
    </StyledRow>
  )
}

export default StakeRow
