/* eslint-disable no-unused-expressions */
import React from 'react'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import Page from 'components/Layout/Page'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useTranslation } from 'contexts/Localization'
import lendMascot from 'assets/lendMascot-big.png'
import PawTop from 'assets/pawTop.svg'
import PawCenter from 'assets/pawCenter.svg'
import PawBottom from 'assets/pawBottom.svg'
import BgHalfCircle from 'assets/bgHalfCircle.svg'
import { useVolume24h } from './hooks/useVolume24h'
import { getTvl } from '../Leverage/helpers'
import LendTable from './components/LendTable/LendTable'

const Section = styled(Flex)`
  background-color: 'transparent';
  font-family: inter;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    height: 8px;
  }
  // height: 135px;
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
  background: url(${PawTop}) no-repeat top left 12%, url(${PawCenter}) no-repeat top 7.5% left 0px,
    url(${PawBottom}) no-repeat bottom 0px left 7%, url(${BgHalfCircle}) no-repeat top center,
    linear-gradient(106.6deg, rgba(133, 76, 230, 0.7) 0%, rgba(95, 0, 216, 0.7) 69.36%) bottom center, #ffffff66;
  backdrop-filter: blur(200px);
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
  // console.log({ volume24h })

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
          <h2
            style={{
              color: '#FFFFFF',
              fontSize: '36px',
              marginLeft: '35px',
            }}
          >
            Huski Finance
          </h2>
         { isMobile ? null : <img
            src={lendMascot}
            alt="huski mascot"
            style={{ width: '100px', height: '100px', position: 'absolute', right: '50px', bottom: '0' }}
          />}
        </SBBox>
        <VolumeBox
          p={isSmallScreen ? '10px' : '30px'}
          style={{
            background: isDark ? 'rgb(57,71,79)' : '#D6C7F0',
            flex: isSmallScreen ? '1 1 10%' : '1 1 10%',
            padding: '18px 30px 30px 30px',
          }}
        >
          {isSmallScreen ? (
            <Flex alignItems="center" justifyContent="space-evenly">
              <img src="/images/8825.svg" width="37.5px" height="37.5px" alt="" />
              <Box>
                <Text fontWeight="700" fontSize="12px" color="textFarm" lineHeight="16px" fontFamily="GenJyuuGothic">
                  {t(`Total Volume 24H:`)}
                </Text>
                {volume24h ? (
                  <Text fontSize="26px" color="textFarm" fontFamily={`'Baloo Bhai 2'`} fontWeight="600">
                    {volume24h}
                  </Text>
                ) : (
                  <Skeleton width="100%" height="30px" />
                )}
              </Box>
            </Flex>
          ) : (
            <>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'inline-block', width: '75%' }}>
                  <Text
                    fontWeight="700"
                    color="textFarm"
                    fontSize="12px"
                    mt="30px"
                    lineHeight="16px"
                    fontFamily="GenJyuuGothic"
                  >
                    {t(`Total Volume 24H:`)}
                  </Text>
                </div>
                <div style={{ display: 'inline-block', verticalAlign: 'middle', width: '22%' }}>
                  <img src="/images/8825.svg" width="37.5px" height="37.5px" alt="" />
                </div>
              </div>
              {volume24h ? (
                <Text
                  fontSize="28px"
                  color="textFarm"
                  style={{
                    letterSpacing: '-0.01em',
                    width: '100%',
                  }}
                  fontFamily={`'Baloo Bhai 2'`}
                  fontWeight="600"
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
            background: isDark ? 'rgb(44,30,73)' : '#E3F0F6',
            flex: isSmallScreen ? '1 1 10%' : '1 1 10%',
            padding: '18px 30px 30px 30px',
          }}
        >
          {isSmallScreen ? (
            <Flex alignItems="center" justifyContent="space-evenly">
              <img src="/images/8826.svg" width="37.5px" height="37.5px" alt="" />
              <Box>
                <Text
                  color="textFarm"
                  lineHeight="16px"
                  fontSize="12px"
                  fontWeight="700"
                  style={{ width: '100%' }}
                  fontFamily="GenJyuuGothic"
                >
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
              <div style={{ width: '100%' }}>
                <div style={{ display: 'inline-block', width: '75%' }}>
                  <Text
                    color="textFarm"
                    mt="30px"
                    lineHeight="16px"
                    fontSize="12px"
                    fontWeight="700"
                    fontFamily="GenJyuuGothic"
                    style={{ width: '100%' }}
                  >
                    {t('Total Value Locked:')}
                  </Text>
                </div>
                <div style={{ display: 'inline-block', verticalAlign: 'middle', width: '22%' }}>
                  <img src="/images/8826.svg" width="37.5px" height="37.5px" alt="" />
                </div>
              </div>
              {totalValueLocked ? (
                <Text
                  fontSize="26px"
                  fontWeight="600"
                  color="textFarm"
                  fontFamily={`'Baloo Bhai 2'`}
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
