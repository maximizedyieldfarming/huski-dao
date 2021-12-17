/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { Box, Button, Flex, Text } from 'husky-uikit1.0'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useClaimFairLaunch } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useTheme from 'hooks/useTheme'
import { useGetPositions } from 'hooks/api'
import { usePositions } from './hooks/usePositions'
import LeverageTable from './components/LeverageTable/LeverageTable'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'

const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const PositionsButton = styled(ActionButton)`
  background-color: unset;
  border-bottom: ${({ isActive, theme }) => (isActive === 'true' ? `2px solid ${theme.colors.secondary}` : 'unset')};
  color: ${({ isActive, theme }) => (isActive === 'true' ? theme.colors.secondary : theme.colors.textSubtle)};
  font-weight: bold;
  border-radius: unset;
  padding: unset;
  padding-bottom: 10px;
  &:first-child {
    margin-right: 1rem;
  }
`
const StyledButton = styled(Button)`
  background: #ffffff;
  border: 1px solid #efefef;
  box-sizing: border-box;
  border-radius: 10px;
  width: 114px;
  height: 32px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
const Section = styled(Flex)`
  // background-color: 'transparent';
  // padding: 0.5rem;
  gap: 1rem;
  // border-radius: ${({ theme }) => theme.radii.default};
  // height: 224px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  // .container {
  //   background-color: ${({ theme }) => theme.colors.background};
  //   padding: 1rem;
  //   border-radius: ${({ theme }) => theme.radii.small};
  // }
  // .block {
  //   background-color: ${({ theme }) => theme.colors.background};
  //   flex: 1;
  //   border-radius: ${({ theme }) => theme.radii.small};
  // }
`
const SBBox = styled(Box)`
  border-radius: ${({ theme }) => theme.radii.default};
  background-image: url('/images/leverage.png');
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
  flex: 5;
  // position: relative;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: 30px;
  }
  display: flex;
  align-items: center;
`

const PositionButtonsContainer = styled(Box)`
  > div {
    // border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.card.background};
  padding: 1px 1px 1px 1px;
  background-size: 400% 400%;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  overflow: hidden;
  padding: 1rem 1.5rem;
`

const Leverage: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { data: farmsData } = useLeverageFarms()
  const [isActivePos, setActive] = useState(true)
  const { isDark } = useTheme()
  usePollLeverageFarmsWithUserData()
  const data = useGetPositions(account)
  const positionData = usePositions(data)
  console.info('positionData', positionData)
  const positionFarmsData = []
  if (
    positionData &&
    positionData !== null &&
    positionData !== undefined &&
    positionData !== [] &&
    positionData.length !== 0
  ) {
    positionData.map((pdata) => {
      let pfarmData
      farmsData.map((farm) => {
        if (
          farm.TokenInfo.address.toUpperCase() === pdata.worker.toUpperCase() ||
          farm.QuoteTokenInfo.address.toUpperCase() === pdata.worker.toUpperCase()
        ) {
          pfarmData = pdata
          pfarmData.farmData = farm
          positionFarmsData.push(pfarmData)
        }
      })
    })
  }

  // if (data && data !== null && data !== undefined) {
  //   data.map((pdata) => {
  //     let pfarmData
  //     farmsData.map((farm) => {
  //       if (farm.workerAddress[56].toUpperCase() === pdata.worker.toUpperCase()) {
  //         pfarmData = pdata
  //         pfarmData.farmData = farm
  //         positionFarmsData.push(pfarmData)
  //       }
  //     })
  //   })
  // }

  console.info('farmsData', farmsData)

  let reward = 0
  const hash = {}
  const positionsWithEarnings = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])
  positionsWithEarnings.map((farm) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const farmEarnings = new BigNumber(parseFloat(farm?.userData?.farmEarnings)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    // console.info('farmEarnings', farmEarnings)
    reward += farmEarnings
    return reward
  })

  return (
    <Page>
      <Section>
        <SBBox>
          <h2 style={{ color: 'white', fontSize: '60px', marginLeft: '80px', fontWeight: 800 }}>
            Huski
            <br /> Finance
          </h2>
        </SBBox>

        <Flex
        flex="1"
          style={{
            padding: '30px',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '15px',
            background: isDark ? 'rgb(57,71,79)' : '#E3F0F6',
          }}
        >
          <img src="/images/crown.png" width="48px" height="48px" alt="" />
          <Text mt="10px" fontSize="13px" fontWeight="600">
            {t('HUSKI Rewards')}
          </Text>
          <Flex justifyContent="space-between" flexDirection="column" alignItems="flex-start">
            <Text mb="5px" color="textFarm" fontWeight="700" fontSize="28px">
              {new BigNumber(reward || 0).toFixed(3, 1)}
            </Text>
            <StyledButton
              as={Link}
              to={(location) => ({ pathname: `${location.pathname}/claim`, state: { farmsData } })}
              disabled={!account}
              scale="sm"
            >
              <Text color="textSubtle">{t('Claim')}</Text>
            </StyledButton>
          </Flex>
        </Flex>
      </Section>

      <StyledTableBorder>
        <PositionButtonsContainer>
          <Box>
            <PositionsButton isActive={isActivePos ? 'true' : 'false'} onClick={() => setActive(true)}>
              {t('Active Positions')}
            </PositionsButton>
            <PositionsButton isActive={isActivePos ? 'false' : 'true'} onClick={() => setActive(false)}>
              {t('Liquidated Positions')}
            </PositionsButton>
          </Box>
        </PositionButtonsContainer>
        {isActivePos ? (
          <ActivePositionsTable positionFarmsData={positionFarmsData} />
        ) : (
          <LiquidatedPositionsTable data={null} />
        )}
      </StyledTableBorder>

      <LeverageTable leverageData={farmsData} />
    </Page>
  )
}

export default Leverage
