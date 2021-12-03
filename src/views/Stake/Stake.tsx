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
  width:114px;
  height:32px;
  margin-left:75px;
`
const RewardsSummarySection = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
   gap: 2rem;
  background-color: transparent;
  overflow:hidden;
  height:220px;
  border-radius: ${({ theme }) => theme.radii.card};
  // padding: 1rem;
  // box-shadow: ${({ theme }) => theme.card.boxShadow};
  > ${Flex} {
    &:first-child {
      background: url('/images/stake/header_bg.png');
      background-repeat:no-repeat;
      background-size:cover;
      flex:1.5 0 900px;
      padding-right:45px;
      padding-bottom: 0;
      border-radius: ${({ theme }) => theme.radii.card};
      // grid-template-columns: 1fr 1fr;
      
    }
    &:nth-child(2) {
      flex:1 0 645px;
      background: url('/images/stake/withdog.png');
      background-repeat:no-repeat;
      border-radius: 12px;
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
      <RewardsSummarySection >
        <Flex justifyContent="space-between">
          <Flex position="relative" flex='1.8' pt="31px" pl='21px'>
            <figure>
              <img width='210px' height="190px" src={FlexingHuski} alt="" />
            </figure>
          </Flex>
          <Flex flex='2' flexDirection="column" justifyContent="space-between" mt='35px' mb='35px' pr="50px" ml="30px" style={{ borderRight: '2px solid white' }}>
            <Flex>
              <Flex>
                <img src="/images/stake/BNB.svg" alt="" />
              </Flex>
              <Flex flexDirection="column">
                <Text ml="25px" color="white" fontSize="13px">{t('HUSKI earned:')}</Text>
                {reward ? (
                  <Text fontSize="28px" color="white" bold ml="25px">
                    {reward.toPrecision(3)}
                  </Text>
                ) : (
                  // <Skeleton width="80px" height="16px" />
                  <Text fontSize="28px" color="white" bold ml="25px">
                    964,342.49
                  </Text>
                )}
              </Flex>
            </Flex>
            <Flex flexDirection="row" >
              <Flex>
                <img src="/images/stake/Wallet.svg" alt="" />
              </Flex>
              <Flex flexDirection="column">
                <Text color="white" fontSize="13px" ml={isSmallScreen ? '0px' : '25px'}>{t('My HUSKI Wallet Balance')}</Text>
                {alpacaBalance ? (
                  <Text fontSize="28px" color="white" bold ml="25px">
                    {alpacaBalance.toNumber().toPrecision(3)}
                  </Text>
                ) : (
                  <Text fontSize="28px" color="white" bold ml="25px">
                    964,342.49
                  </Text>
                )}
              </Flex>

            </Flex>
          </Flex>
          <Flex flex='2' justifyContent="space-between" mt='35px' mb='45px' pr="50px" ml="20px" flexDirection="column" alignItems="center">
            <Flex ml="25px">
              <img src="/images/stake/Lock.svg" alt="" />
              <Flex flexDirection="column">
                <Text color="white" fontSize="13px" ml={isSmallScreen ? '0px' : '25px'}>{t('Unstaked Rewards')}</Text>
                <Text fontSize="28px" color="white" bold ml="25px">
                  964,342.49
                </Text>
              </Flex>
            </Flex>
            <Flex>
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
        </Flex>

        {/* <Flex className="balanceLockedWrapper">

            <Flex flexDirection="column">
              <Flex flexDirection={isSmallScreen ? 'column' : 'row'} mb="1rem">
                <LockIcon width="24px" height="24px" color="gold" />
                <Text ml={isSmallScreen ? '0px' : '5px'}>{t('Remaining Locked Amount')}</Text>
              </Flex>
              <Text color="secondary" bold fontSize="3">
                {remainingLockedAmount.toPrecision(3)}
              </Text>
            </Flex>
          </Flex> */}
        <Flex flexDirection="row" alignItems="center">
          <Text fontWeight="800" width="50%" ml="24px" fontSize="30px" lineHeight="38px" color="#000000">{t('Huski Finance Advertisement')}</Text>

        </Flex>


      </RewardsSummarySection>

      <StakeTable stakeData={farmsData} />
    </Page>
  )
}

export default Stake
