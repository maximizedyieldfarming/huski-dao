import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Text, Button, Flex, Box, Skeleton, Grid, useMatchBreakpoints, AutoRenewIcon } from 'husky-uikit1.0'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { getHuskiAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { WalletIcon, LockIcon, FlexingHuski } from 'assets'
import StakeTable from './components/StakeTable/StakeTable'

const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
  width: 114px;
  height: 32px;
  // margin-left: 75px;
`
const RewardsSummarySection = styled(Flex)`
  // flex-direction: column;
  // ${({ theme }) => theme.mediaQueries.md} {
  //   flex-direction: row;
  // }
  min-width : 600px!important;
  gap: 2rem;
  overflow: hidden;
  height: 220px;
  border-radius: ${({ theme }) => theme.radii.card};
  background: url('/images/stake/header_bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  figure {
    height: 100%;
    padding: 1.5rem 1.5rem 0;
    img {
      height: 100%;
      box-sizing: border-box;
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      filter: drop-shadow(-6px 0px 0px white);
    }
  }
  @media screen and (max-width : 950px){
    min-width : unset!important;
  }
`

const AdvertisementContainer = styled(Flex)`
  background: url('/images/stake/withdog.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  min-height : 200px;
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
  farmsData.map((stake) => {
    const earnings = new BigNumber(parseFloat(stake?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += earnings
    return reward
  })

  const { balance } = useTokenBalance(getHuskiAddress())
  const alpacaBalance = balance ? balance.dividedBy(BIG_TEN.pow(18)) : BIG_ZERO

  let remainingLockedAmount = 0
  farmsData.map((stake) => {
    remainingLockedAmount = new BigNumber(parseFloat(stake?.userData?.unlockedRewards))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    return remainingLockedAmount
  })

  let unlockedRewards = 0
  farmsData.map((stake) => {
    unlockedRewards = new BigNumber(parseFloat(stake?.userData?.unlockedRewards)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    return unlockedRewards
  })

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  return (
    <Page>
      <Flex flexDirection={isSmallScreen ? 'column' : 'row'} flexWrap="wrap" style={{ gap: '3rem' }}>
        <RewardsSummarySection flex="1.5">
          {isSmallScreen ? null : (
            <figure>
              <img width="210px" height="190px" src={FlexingHuski} alt="" />
            </figure>
          )}
          <Flex padding="1.5rem">
            <Flex
              flexDirection="column"
              justifyContent="space-between"
              style={{ borderRight: '2px solid white' }}
              pr="1.5rem"
            >
              <Flex
                alignItems={isSmallScreen ? 'flex-start' : 'center'}
                flexDirection={isSmallScreen ? 'column' : 'row'}
              >
                <Box height="3rem" width="3rem">
                  <img src="/images/stake/BNB.svg" alt="" />
                </Box>
                <Box ml={isSmallScreen ? '0px' : '25px'} mb={isSmallScreen ? '8px' : '0px'}>
                  <Text color="white" fontSize="13px">
                    {t('HUSKI earned:')}
                  </Text>
                  {reward ? (
                    <Text fontSize="28px" color="white" bold>
                      {new BigNumber(reward).toFixed(3, 1)}
                    </Text>
                  ) : (
                    <Skeleton width="80px" height="16px" />
                  )}
                </Box>
              </Flex>
              <Flex
                alignItems={isSmallScreen ? 'flex-start' : 'center'}
                flexDirection={isSmallScreen ? 'column' : 'row'}
              >
                <Box height="3rem" width="3rem">
                  <img src="/images/stake/Wallet.svg" alt="" />
                </Box>
                <Box ml={isSmallScreen ? '0px' : '25px'}>
                  <Text color="white" fontSize="13px">
                    {t('My HUSKI Wallet Balance')}
                  </Text>
                  {alpacaBalance ? (
                    <Text fontSize="28px" color="white" bold>
                      {alpacaBalance.toNumber().toPrecision(3)}
                    </Text>
                  ) : (
                    <Skeleton width="80px" height="16px" />
                  )}
                </Box>
              </Flex>
            </Flex>
            <Flex flexDirection="column" justifyContent="space-between" pl="1.5rem">
              <Flex
                alignItems={isSmallScreen ? 'flex-start' : 'center'}
                flexDirection={isSmallScreen ? 'column' : 'row'}
              >
                <Box height="3rem" width="3rem">
                  <img src="/images/stake/Lock.svg" alt="" />
                </Box>
                <Box ml={isSmallScreen ? '0px' : '25px'}>
                  <Text color="white" fontSize="13px">
                    {t('Unstaked Rewards')}
                  </Text>
                  <Text fontSize="28px" color="white" bold>
                    {new BigNumber(unlockedRewards).toFixed(3, 1)}
                  </Text>
                </Box>
              </Flex>
              <StyledButton
                onClick={handleConfirmClick}
                isLoading={isPending}
                disabled={!account || Number(unlockedRewards) === 0}
                endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
              >
                {isPending ? t('Claiming') : t('Claim')}
              </StyledButton>
            </Flex>
          </Flex>
        </RewardsSummarySection>
        <AdvertisementContainer flexDirection="row" alignItems="center" flex="1">
          <Text fontWeight="800" width="50%" ml="24px" fontSize="30px" lineHeight="38px" color="#000000">
            {t('Huski Finance Advertisement')}
          </Text>
        </AdvertisementContainer>
      </Flex>

      <StakeTable stakeData={farmsData} />
    </Page>
  )
}

export default Stake
