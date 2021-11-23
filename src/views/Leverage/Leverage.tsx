/* eslint-disable array-callback-return */
import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useLeverageFarms, usePollLeverageFarmsWithUserData, useCakePrice } from 'state/leverage/hooks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import styled from 'styled-components'
import { Box, Button, Flex, Text } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import { useClaimFairLaunch } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useGetPositions } from 'hooks/api'
import { usePositions } from './hooks/usePositions'
import LeverageTable from './components/LeverageTable/LeverageTable'
import ActivePositionsTable from './components/PositionsTable/ActivePositionsTable'
import LiquidatedPositionsTable from './components/PositionsTable/LiquidatedPositionsTable'
import { getYieldFarming, getTvl } from './helpers'

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

const RewardsContainer = styled(Box)`
  flex-direction: row;
  position: relative;
  align-self: flex-end;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
`

const PositionButtonsContainer = styled(Box)`
  > div {
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
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
  usePollLeverageFarmsWithUserData()
  const data = [] // useGetPositions(account)
  const positionData = usePositions(data)
  console.info('positionData', positionData)
  const positionFarmsData = []
  if (positionData && positionData !== null && positionData !== undefined && positionData !== [] && positionData.length !== 0) {
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
  positionFarmsData.map((farm) => {
    const farmEarnings = new BigNumber(parseFloat(farm?.farmData?.userData?.farmEarnings))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    reward += farmEarnings
    return reward
  })

  return (
    <Page>
      <RewardsContainer>
        <Text mb="8px">{t('HUSKI Rewards')}</Text>
        <Flex justifyContent="space-between" alignItems="flex-end" style={{ gap: '4rem' }}>
          <Text color="secondary" bold fontSize="2">
            {reward.toPrecision(3)}
          </Text>
          <Button
            as={Link}
            to={{ pathname: '/leverage/claim', state: { farmsData } }}
            disabled={!account}
            scale="sm"
          >
            {t('Claim')}
          </Button>
        </Flex>
      </RewardsContainer>

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
