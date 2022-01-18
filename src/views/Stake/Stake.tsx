import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  Text,
  Button,
  Flex,
  Box,
  Skeleton,
  useMatchBreakpoints,
  AutoRenewIcon,
} from '@huskifinance/huski-frontend-uikit'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { getHuskiAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { FlexingHuski } from 'assets'
import StakeTable from './components/StakeTable/StakeTable'
import headerBg from './BG.png'

const Section = styled(Flex)`
  background-color: 'transparent';
  font-family: inter;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    height: 8px;
  }
  height: 135px;
  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 135px;
    flex-direction: row;
    justify-content: space-between;
    > div:not(:last-child) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`

const SBBox = styled(Box)`
  > h2 {
    font-family: 'BalooBhaijaan';
  }
  align-items: center;
  display: flex;
  border-radius: 15px !important;
  background-image: url(${headerBg});
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  min-width: 520px;
  @media screen and (max-width: 1480px) {
    padding: 30px 0px;
  }
  @media screen and (max-width: 600px) {
    min-width: unset;
    > h2 {
      margin-left: 20px !important;
      font-size: 35px !important;
    }
  }
`

const VolumeBox = styled(Box)`
  flex-direction: column;
  justify-content: space-evenly;
  border-radius: 15px !important;
`

const ValueBox = styled(Box)`
  flex-direction: column;
  justify-content: space-evenly;
  border-radius: ${({ theme }) => theme.radii.default};
`

const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
  width: 5rem;
  height: 32px;
`

const Stake: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { data: farmsData } = useStakes()
  console.log({ farmsData })
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
      <Section>
        <SBBox
          className="block"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            flex: isSmallScreen ? '1' : '5',
          }}
        >
          <div>
            <Text color="#FFFFFF" fontSize="16px" fontWeight="700">
              {t('HUSKI earned:')}
            </Text>
          </div>
          <div>
            {reward ? (
              <Text fontSize="28px" color="white" bold>
                {new BigNumber(reward).toFixed(3, 1)}
              </Text>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </div>
        </SBBox>
        <VolumeBox
          p={isSmallScreen ? '10px' : '30px'}
          style={{
            background: '#E3F0F6',
            flex: '1 1 10%',
            padding: '18px 30px 30px 30px',
          }}
        >
          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-block', width: '75%' }}>
              <Text fontWeight="700" color="textFarm" fontSize="12px" mt="30px" lineHeight="16px">
                {t('My HUSKI Wallet')}
              </Text>
            </div>
            <div style={{ display: 'inline-block', verticalAlign: 'middle', width: '22%' }}>
              <img src="/images/8825.svg" width="37.5px" height="37.5px" alt="" />
            </div>
          </div>
          {alpacaBalance ? (
            <Text
              fontSize="28px"
              color="textFarm"
              style={{
                letterSpacing: '-0.01em',
                width: '100%',
              }}
              fontFamily="LexendDeca"
              fontWeight="400"
            >
              {alpacaBalance.toNumber().toPrecision(3)}
            </Text>
          ) : (
            <Skeleton width="100%" height="30px" my="6px" />
          )}

        </VolumeBox>
        <ValueBox
          p={isSmallScreen ? '10px' : '30px'}
          style={{
            background: '#D6C7F0',
            flex: '1 1 15%',
            padding: '18px 30px 30px 30px',
          }}
        >
            <Text color="textFarm" mt="30px" lineHeight="16px" fontSize="12px" fontWeight="700" style={{ width: '100%' }}>
              {t('Unstaked Rewards')}
            </Text>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'inline-block', width: '66%' }}>
              {!unlockedRewards ? (
                <Text
                  fontSize="28px"
                  style={{ letterSpacing: '-0.01em' }}
                  color="textFarm"
                  fontFamily="LexendDeca"
                >
                  {new BigNumber(unlockedRewards).toFixed(3, 1)}
                  </Text>
              ) : (
                <Skeleton width="65%" height="30px" my="6px" />
              )}
            </div>
            <div style={{ display: 'inline-block', width: '30%' }}>
              <StyledButton
                onClick={handleConfirmClick}
                isLoading={isPending}
                disabled={!account || Number(unlockedRewards) === 0}
                endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
              >
                <Text color="textSubtle">{isPending ? t('Claiming') : t('Claim')}</Text>
              </StyledButton>
            </div>
          </div>
        </ValueBox>
      </Section>

      <StakeTable stakeData={farmsData} />
    </Page>
  )
}

export default Stake
