/* eslint-disable no-unused-expressions */
import React from 'react'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Page from 'components/Layout/Page'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useTranslation } from 'contexts/Localization'
import { useVolume24h } from './hooks/useVolume24h'
import { getTvl } from '../Leverage/helpers'
import LendTable from './components/LendTable/LendTable'
import headerBg from './BG.png'

const Section = styled(Flex)`
  background-color: 'transparent';
  font-family: inter;
  padding: 0.5rem 0;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    height: 8px;
  }
  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
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

const Lend: React.FC = () => {
  const { t } = useTranslation()
  const { data: farmsData } = useLeverageFarms()

  let lpTokensTvl = 0
  farmsData.map((farm) => {
    const { totalTvl } = getTvl(farm)
    lpTokensTvl += Number(totalTvl)
    return lpTokensTvl
  })

  const hash = {}
  const { isDark } = useTheme()
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })

  let depositTotalToken = 0
  let depositTotalDebtVal = 0
  lendData.map((farm) => {
    const { totalToken, vaultDebtVal, tokenPriceUsd } = farm
    const totalSupplyUSD = (Number(totalToken) * Number(tokenPriceUsd)) / 10 ** 18
    const totalBorrowedUSD = (Number(vaultDebtVal) * Number(tokenPriceUsd)) / 10 ** 18
    depositTotalToken += totalSupplyUSD
    depositTotalDebtVal += totalBorrowedUSD
    return { depositTotalToken, depositTotalDebtVal }
  })

  const totalValueLocked = Number(lpTokensTvl) + Number(depositTotalToken) - Number(depositTotalDebtVal)
  const totalValueLockedValue = totalValueLocked.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  const volume24hnum = useVolume24h()
  const volume24h = volume24hnum

  return (
    <Page>
      <Section>
        <SBBox
          className="block"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            // width: isSmallScreen ? '100%' : '888px',
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
                <Text fontWeight="600" color="textFarm" fontSize="13px">
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
              <Text fontWeight="600" color="textFarm" mt="30px" fontSize="13px">
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
                <Text color="textFarm" fontSize="13px" fontWeight="600" style={{ width: '100%' }}>
                  {t('Total Value Locked:')}
                </Text>
                {totalValueLocked ? (
                  <Text
                    fontSize="28px"
                    style={{ letterSpacing: '-0.01em' }}
                    color="textFarm"
                    fontFamily="LexendDeca"
                  >{`${totalValueLockedValue}`}</Text>
                ) : (
                  <Skeleton width="100%" height="30px" />
                )}
              </Box>
            </Flex>
          ) : (
            <>
              <img src="/images/8826.svg" width="70px" height="70px" alt="" />
              <Text color="textFarm" mt="30px" fontSize="13px" fontWeight="600" style={{ width: '100%' }}>
                {t('Total Value Locked:')}
              </Text>
              {totalValueLocked ? (
                <Text
                  fontSize="28px"
                  style={{ letterSpacing: '-0.01em' }}
                  color="textFarm"
                  fontFamily="LexendDeca"
                >{`${totalValueLockedValue}`}</Text>
              ) : (
                <Skeleton width="100%" height="30px" my="6px" />
              )}
            </>
          )}
        </ValueBox>
      </Section>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
