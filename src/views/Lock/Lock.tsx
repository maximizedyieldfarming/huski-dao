import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { Link } from 'react-router-dom'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import {
  Text,
  Button,
  Flex,
  Box,
  Skeleton,
  useMatchBreakpoints,
  MetamaskIcon,
  AutoRenewIcon,
} from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import Page from 'components/Layout/Page'
import { useCakeVaultContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { WalletIcon, LockIcon, FlexingHuski } from 'assets'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import { useVolume24h } from 'views/Lend/hooks/useVolume24h'
import { getHuskiAddress } from 'utils/addressHelpers'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import useTokenBalance from 'hooks/useTokenBalance'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import LockTable from './components/LockTable/LockTable'

const StyledButton = styled(Button)`
  background-color: ${({ disabled }) => (disabled ? '#D3D3D3' : '#7B3FE4')};
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? '#6F767E' : 'white')};
`
const RewardsSummarySection = styled(Flex)`
  flex-direction: column;
  flex-wrap: wrap;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  gap: 2rem;
  background-color: transparent;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.card};
  // padding: 1rem;
  // box-shadow: ${({ theme }) => theme.card.boxShadow};
  > ${Flex} {
    &:first-child {
      background: url('/images/stake/header_bg.png');
      background-repeat: no-repeat;
      background-size: cover;
      padding-bottom: 0;
      border-radius: 40px;
      // grid-template-columns: 1fr 1fr;
      ${Flex} {
        &:nth-child(2) {
          @media screen and (max-width: 700px) {
            border: none !important;
          }
        }
      }
    }
    &:nth-child(2) {
      background: url('/images/stake/withdog.png');
      background-repeat: no-repeat;
      border-radius: 12px;
      background-size: 100% 100%;
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

const Section = styled(Flex)`
  gap: 1rem;
  > ${Box}:first-child {
    margin-bottom: 1rem;
  }

  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    > ${Box}:first-child {
      margin-bottom: 0;
      margin-right: 1rem;
    }
    flex-direction: row;
  }
  .container {
  
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  &.balanceWrapper {
    flex: 1;
    justify-content: space-between;
    > ${Flex} {
      padding: 5px 10px;
      flex-direction: column;
      gap: 10px;
      ${({ theme }) => theme.mediaQueries.lg} {
        flex-direction: row;
      }
      &:first-child {
        border-right: 2px solid ${({ theme }) => theme.colors.textDisabled};
        @media screen and (max-width: 750px) {
          border: none !important;
        }
        padding-right: 50px;
      }
      &:last-child {
        // border-left: 1px solid ${({ theme }) => theme.colors.textDisabled};
      }
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

const SBBox = styled(Box)`
  > h2 {
    font-family: 'BalooBhaijaan';
  }
  align-items: center;
  display: flex;
  border-radius: 15px !important;
  background-image: url('/images/leverage.png');
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  width: calc(85% - 300px);
  min-width: 520px;
  padding-top: 30px;
  @media screen and (max-width: 960px) {
    width: 100%;
  }
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
const HuskiBox = styled(Flex)`
  flex-direction: column;
  flex-wrap: wrap;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  padding: 30px 20px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  
  
  > ${Flex}{
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      padding: 10px 20px 10px 20px
      
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;  
    gap: 4rem;
  }
  
  .walletBalance {
    
    > ${Flex} {
      gap: 2rem;

    }
    ${({ theme }) => theme.mediaQueries.lg} {
      justify-content: left;
      padding-right: 5rem;
      gap: 5rem;
      border-right: 2px solid #efefef;
      border-right-height: 5px;
    }
  }
  .earnedBalance {
    > ${Flex} {
      gap: 2rem;

    }
    ${({ theme }) => theme.mediaQueries.lg} {
      justify-content: right;
      gap: 8rem;
    }
  }
`

const Lock: React.FC = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { data: farmsData } = useStakes()
  const sHuskiBalance = null
  const volume24hnum = useVolume24h()
  const volume24h = volume24hnum
  const volumeLocked = null
  const lockData = farmsData.filter((f) => f.pid === 5)

  // =============banner==============
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
  const { isDark } = useTheme()
  return (
    <Page>
      {/* <Section>
        <Box className="block" />
        <Box className="container">
          <Text color="textSubtle">{t('Total Volume 24H')}</Text>
          {volume24 ? <Text>{volume24}</Text> : <Skeleton width="80px" height="16px" />}
        </Box>
        <Box className="container">
          <Text color="textSubtle">{t('Total Volume Locked')}</Text>
          {volumeLocked ? <Text color="secondary">{`$${volumeLocked}`}</Text> : <Skeleton width="80px" height="16px" />}
        </Box>
      </Section> */}
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
          <h2
            style={{
              fontFamily: 'Baloo Bhaijaan',
              color: '#FFFFFF',
              fontSize: '64px',
              marginLeft: '80px',
              fontWeight: 400,
            }}
          >
            Huski Finance
          </h2>
        </SBBox>
        <VolumeBox
          p={isSmallScreen ? '10px' : '30px'}
          style={{
            background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
            // width: isSmallScreen ? '100%' : '316px',
            flex: isSmallScreen ? '1' : '1',
          }}
        >
          {isSmallScreen ? (
            <Flex alignItems="center" justifyContent="space-evenly">
              <img src="/images/8825.svg" width="50px" height="50px" alt="" />
              <Box>
                <Text fontWeight="700" color="textFarm" fontSize="16px" lineHeight="16px">
                  {t(`Total Volume 24H:`)}
                </Text>
                {volume24h ? (
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
                    {volume24h}
                  </Text>
                ) : (
                  <Skeleton width="100%" height="30px" />
                )}
              </Box>
            </Flex>
          ) : (
            <>
              <img src="/images/8825.svg" width="70px" height="70px" alt="" />
              <Text fontWeight="700" color="textFarm" mt="30px" fontSize="16px" lineHeight="16px">
                {t(`Total Volume 24H:`)}
              </Text>
              {volume24h ? (
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
                  {volume24h}
                </Text>
              ) : (
                <Skeleton width="100%" height="30px" my="6px" />
              )}
            </>
          )}
        </VolumeBox>
        <ValueBox
          p={isSmallScreen ? '10px' : '30px'}
          style={{
            background: isDark ? 'rgb(44,30,73)' : '#D6C7F0',
            // width: isSmallScreen ? '100%' : '316px',
            flex: isSmallScreen ? '1' : '1',
          }}
        >
          {isSmallScreen ? (
            <Flex alignItems="center" justifyContent="space-evenly">
              <img src="/images/8826.svg" width="50px" height="50px" alt="" />
              <Box>
                <Text color="textFarm" fontSize="16px" lineHeight="16px" fontWeight="700" style={{ width: '100%' }}>
                  {t('Total Value Locked:')}
                </Text>
                {/* {totalValueLocked ? (
                  <Text
                    fontSize="28px"
                    style={{ letterSpacing: '-0.01em' }}
                    color="textFarm"
                    fontFamily="LexendDeca"
                >{`${volumeLocked}`}</Text> */}
                    <Text
                    fontSize="28px"
                    style={{ letterSpacing: '-0.01em' }}
                    color="textFarm"
                    fontFamily="LexendDeca" > </Text>  

                ) : (
                  <Skeleton width="100%" height="30px" />
                )
              </Box>
            </Flex>
          ) : (
            <>
              <img src="/images/8826.svg" width="70px" height="70px" alt="" />
              <Text color="textFarm" mt="30px" fontSize="16px" lineHeight="16px" fontWeight="700" style={{ width: '100%' }}>
                {t('Total Value Locked:')}
              </Text>
              {/* {totalValueLocked ? (
                  <Text
                    fontSize="28px"
                    style={{ letterSpacing: '-0.01em' }}
                    color="textFarm"
                    fontFamily="LexendDeca"
                >{`${volumeLocked}`}</Text> */}
                    <Text
                    fontSize="28px"
                    style={{ letterSpacing: '-0.01em' }}
                    color="textFarm"
                    fontFamily="LexendDeca" >  </Text>  
              
                <Skeleton width="100%" height="30px" my="6px" />
              
            </>
          )}
        </ValueBox>
      </Section>

      <HuskiBox 
        width="calc(100%)"
        p={isSmallScreen ? '10px' : '30px'}
        style={{
        // width: isSmallScreen ? '100%' : '316px',
        flex: isSmallScreen ? '1' : '1',
      }}>
        <Flex width="calc(50%-100px)" className="walletBalance" >
          <Flex alignItems="center" width= 'fit-content' justifyContent="space-evenly">
            <img src="/images/wallet.png" width="30px" height="30px" alt="" />
        
            <Text bold lineHeight="1.9"  margin-left="20px"
            style={{ width: '240px', height: '30px', justifySelf: 'flex-start'}}>
              {t("My sHUSKI Wallet Balance")}</Text>
           </Flex>
          {/* 
          <Text
            fontSize="28px"
            style={{ letterSpacing: '-0.01em' , paddingLeft: '20px'}}
            color="textFarm"
            fontFamily="LexendDeca" >  </Text>  
        
          <Skeleton width="100%" height="30px" my="6px" /> */}
          <Text bold lineHeight="1.9" fontSize="25px">969,945.57</Text>
          <MetamaskIcon width="30px" />
          
          
       </Flex>
       <Flex width="calc(50%-100px)" className="earnedBalance" >
          <Flex alignItems="center" justifyContent="space-evenly">
            <img src="/images/8826.svg" width="40px" height="40px" alt="" />
            <Text bold lineHeight="1.9" margin-left="20px"
            style={{ width: '200px', height: '30px', justifySelf: 'flex-start' }}>
              {t('HUSKI earned:')}</Text>
          
          {reward ? (
                  <Text fontSize="28px" color="white" bold>
                    {new BigNumber(reward).toFixed(3, 1)}
                  </Text>
                ) : (
                  <Skeleton width="100px" height="30px"  my="6px" />
                )}
          {/*  
          <Text
            fontSize="28px"
            style={{ letterSpacing: '-0.01em' , paddingLeft: '20px'}}
            color="textFarm"
            fontFamily="LexendDeca" >  </Text>  
        
          <Skeleton width="100%" height="30px" my="6px" /> */}
        </Flex>
        <StyledButton
          disabled={!account || Number(reward) === 0}
          onClick={handleConfirmClick}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Claiming') : t('Claim')}
        </StyledButton>
      </Flex>
    
      </HuskiBox>

      <LockTable data={lockData} />
    </Page>
  )
}

export default Lock
