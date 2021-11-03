import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Text, Button, Flex, Box, Skeleton, Grid, useMatchBreakpoints, AutoRenewIcon } from '@pancakeswap/uikit'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { getHuskiAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import husky2 from './assets/stake_rewards_img.png'
import StakeTable from './components/StakeTable/StakeTable'
import { WalletIcon, LockIcon } from './assets'

const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
`
const RewardsSummarySection = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  gap: 2rem;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  > ${Grid} {
    &:first-child {
      background-color: #3ed3dd;
      padding: 1rem;
      padding-bottom: 0;
      border-radius: ${({ theme }) => theme.radii.card};
      grid-template-columns: 1fr 1fr;
      flex: 1;
    }
  }

  .balanceLockedWrapper {
    border-bottom: 1px solid ${({ theme }) => theme.colors.textSubtle};
    > div {
      flex: 1;
      padding: 1rem;
      &:first-child {
        border-right: 1px solid ${({ theme }) => theme.colors.textSubtle};
      }
      &:last-child {
        //border-left: 1px solid ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
  figure {
    // position: absolute;
    // top: 0;
    // right: -10px;
    height: 100%;
    img {
      height: 100%;
      box-sizing: border-box;
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      filter: drop-shadow(-6px 0px 0px white);
    }
  }
`

const Stake: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { data: farmsData } = useStakes()
  console.log({ ' 数据': farmsData })
  useStakeWithUserData()

  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess, toastInfo } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const [isPending, setIsPending] = useState<boolean>(false)
  const handleConfirmClick = async () => {
    setIsPending(true)
    toastInfo('Pending request...', 'Please Wait!')
    try {
      const tx = await callWithGasPrice(cakeVaultContract, 'harvest', undefined, { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
    }
  }

  let reward = 0
  farmsData.map((farm) => {
    const earnings = new BigNumber(parseFloat(farm?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += earnings
    return reward
  })

  const { balance } = useTokenBalance(getHuskiAddress())
  const alpacaBalance = balance ? balance.dividedBy(BIG_TEN.pow(18)) : BIG_ZERO

  let remainingLockedAmount = 0
  farmsData.map((farm) => {
    remainingLockedAmount = new BigNumber(parseFloat(farm?.userData?.unlockedRewards))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    return remainingLockedAmount
  })

  let unlockedRewards = 0
  farmsData.map((farm) => {
    unlockedRewards = new BigNumber(parseFloat(farm?.userData?.unlockedRewards)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    return unlockedRewards
  })

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  return (
    <Page>
      <RewardsSummarySection padding="10px 8px 0 32px">
        <Grid>
          <Box>
            <Text color="white">{t('HUSKI earned:')}</Text>
            {reward ? (
              <Text color="white" bold fontSize="3">
                {reward.toPrecision(3)}
              </Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </Box>
          <Box position="relative">
            <figure>
              <img src={husky2} alt="" />
            </figure>
          </Box>
        </Grid>
        <Grid flex="2">
          <Flex className="balanceLockedWrapper">
            <Flex flexDirection="column">
              <Flex flexDirection={isSmallScreen ? 'column' : 'row'} mb="1rem">
                <WalletIcon width="24px" height="24px" color="gold" />
                <Text ml={isSmallScreen ? '0px' : '5px'}>{t('My HUSKI Wallet Balance')}</Text>
              </Flex>
              {alpacaBalance ? (
                <Text color="secondary" bold fontSize="3">
                  {alpacaBalance.toNumber().toPrecision(3)}
                </Text>
              ) : (
                <Skeleton width="80px" height="16px" />
              )}
            </Flex>
            <Flex flexDirection="column">
              <Flex flexDirection={isSmallScreen ? 'column' : 'row'} mb="1rem">
                <LockIcon width="24px" height="24px" color="gold" />
                <Text ml={isSmallScreen ? '0px' : '5px'}>Remaining Locked Amount</Text>
              </Flex>
              <Text color="secondary" bold fontSize="3">
                {remainingLockedAmount.toPrecision(3)}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" padding="1rem">
            <Text>Unlocked Rewards</Text>
            <Text color="secondary" bold fontSize="3">
              {unlockedRewards.toPrecision(3)}
            </Text>
            <StyledButton
              onClick={handleConfirmClick}
              isLoading={isPending}
              disabled={!account || Number(unlockedRewards) === 0}
              endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
            >
              {' '}
              {isPending ? t('Claiming') : t('Claim')}
            </StyledButton>
          </Flex>
        </Grid>
      </RewardsSummarySection>

      <StakeTable stakeData={farmsData} />
    </Page>
  )
}

export default Stake
