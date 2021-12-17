/* eslint-disable no-unused-expressions */
import React from 'react'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from 'husky-uikit1.0'
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
  padding: 0.5rem;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.default};
  height: 224px;
  .container {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.small};
  }
`
const SBBox = styled(Box)`
  border-radius: 15px !important;
  background-image: url(${headerBg});
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
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
  lendData.map((farm) => {
    const { totalToken, tokenPriceUsd } = farm
    const totalSupplyUSD = (Number(totalToken) * Number(tokenPriceUsd)) / 10 ** 18
    depositTotalToken += totalSupplyUSD
    return depositTotalToken
  })

  const totalValueLocked = Number(lpTokensTvl) + Number(depositTotalToken)
  const totalValueLockedValue = totalValueLocked.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()

  const volume24hnum = undefined
  useVolume24h('1638748800')

  return (
    <Page>
      <Section>
        <SBBox
          className="block"
          style={{ position: 'relative', marginRight: '25px', display: 'flex', alignItems: 'center' }}
        >
          <h2 style={{ color: 'white', fontSize: '60px', marginLeft: '80px', fontWeight: 800 }}>
            Huski
            <br /> Finance
          </h2>
        </SBBox>
        <Flex
          className="container"
          style={{
            padding: '30px',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
            borderRadius: '15px',
            width: '20%',
            marginRight: '25px',
          }}
        >
          <img src="/images/8825.svg" width="70px" height="70px" alt="" />
          <Text fontWeight="600" color="textFarm" mt="30px" fontSize="13px">
            {t(`Total Volume 24H:`)}
          </Text>
          {volume24hnum ? (
            <Text fontSize="30px" color="textFarm">
              {volume24hnum}
            </Text>
          ) : (
            <Skeleton width="180px" height="30px" />
          )}
          <Text fontSize="30px">{volume24hnum}</Text>
        </Flex>
        <Flex
          className="container"
          style={{
            padding: '30px',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            background: isDark ? 'rgb(44,30,73)' : '#D6C7F0',
            borderRadius: '15px',
            width: '20%',
          }}
        >
          <img src="/images/8826.svg" width="70px" height="70px" alt="" />
          <Text color="textFarm" mt="30px" fontSize="13px" fontWeight="600">
            {t('Total Value Locked:')}
          </Text>
          {totalValueLocked ? (
            <Text
              fontSize="28px"
              style={{ letterSpacing: '-0.01em' }}
              color="textFarm"
              fontWeight="bold"
            >{`${totalValueLockedValue}`}</Text>
          ) : (
            <Skeleton width="180px" height="30px" />
          )}
        </Flex>
      </Section>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
