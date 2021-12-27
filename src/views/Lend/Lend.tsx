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
  padding: 0.5rem 0;
  gap: 0.5rem;
  // border-radius: ${({ theme }) => theme.radii.default};
  // height: 224px;
  flex-flow: row wrap;

  .container {
    // background-color: ${({ theme }) => theme.colors.background};
    // padding: 1rem;
    overflow: auto;
    gap: 2rem;
    flex-wrap : wrap;
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.default};
  }
`
const SBBox = styled(Box)`
  >h2{
    font-family : 'BalooBhaijaan';
  }
  align-items : center;
  display : flex;
  border-radius: 15px !important;
  background-image: url(${headerBg});
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  min-width : 520px;
  @media screen and (max-width : 1480px){
    padding : 30px 0px;
    margin-right : 0px!important;
  }
  @media screen and (max-width : 600px){
    min-width : unset;
    >h2{
      margin-left : 20px!important;
      font-size : 35px!important;
    }
  }
`
const VolumeBox = styled(Box)`
  padding: 30px;
  flex-direction: column;
  justify-content: space-evenly;
  // background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
  // width: 20%;
  margin-right: 25px;
  border-radius: ${({ theme }) => theme.radii.default};
`
const ValueBox = styled(Box)`
  padding: 30px;
  flex-direction: column;
  justify-content: space-evenly;
  // background: isDark ? 'rgb(44,30,73)' : '#D6C7F0';
  // width: 20%;
  border-radius: ${({ theme }) => theme.radii.default};
`

const SBPage = styled(Page)`
  @media screen and (max-width : 425px){
    padding-left : 5px;
    padding-right : 5px;
    margin-left : 2%;
    margin-right : 2%;
  }
  margin-left : 0px;
  margin-right : 0px;
  padding-left : 40px;
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

  const volume24hnum = useVolume24h()
  const volume24h = volume24hnum

  return (
    <SBPage>
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
        <Flex className="container">
          <VolumeBox
            // className="container"
            style={{
              // padding: '30px',
              // flexDirection: 'column',
              // justifyContent: 'space-evenly',
              background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
              // borderRadius: '15px',
              // width: '20%',
              // marginRight: '25px',
            }}
          >
            <img src="/images/8825.svg" width="70px" height="70px" alt="" />
            <Text fontWeight="600" color="textFarm" mt="30px" fontSize="13px">
              {t(`Total Volume 24H:`)}
            </Text>
            {volume24h ? (
              <Text fontSize="30px" color="textFarm" fontFamily='LexendDeca'>
                {volume24h}
              </Text>
            ) : (
              <Skeleton width="180px" height="30px" />
            )}
          </VolumeBox>
          <ValueBox
            // className="container"
            style={{
              // padding: '30px',
              // flexDirection: 'column',
              // justifyContent: 'space-evenly',
              background: isDark ? 'rgb(44,30,73)' : '#D6C7F0',
              // borderRadius: '15px',
              // width: '20%',
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
                fontFamily='LexendDeca'
              >{`${totalValueLockedValue}`}</Text>
            ) : (
              <Skeleton width="180px" height="30px" />
            )}
          </ValueBox>
        </Flex>
      </Section>

      <LendTable lendData={lendData} />
    </SBPage>
  )
}

export default Lend
