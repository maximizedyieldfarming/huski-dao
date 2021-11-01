import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Text, Button, Flex, Box, Skeleton, Grid } from '@pancakeswap/uikit'
import { useStakeWithUserData, useStakes, useHuskyPrice } from 'state/stake/hooks'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import usePersistState from 'hooks/usePersistState'
import { useTranslation } from 'contexts/Localization'
import { getHuskiAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { orderBy } from 'lodash'
import { latinise } from 'utils/latinise'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { getStakeApy } from 'views/Stake/helpers'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import husky2 from './assets/stake_rewards_img.png'
import StakeTable from './components/StakeTable/StakeTable'
import TopTable from './components/TopTable/TopTable'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'


const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

const ImageContainer = styled.figure`
  // position: absolute;
  // right: -10px;
`

const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  box-shadow: none;
`
const RewardsSummarySection = styled(Flex)`
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
  gap: 2rem;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 20px;
  padding: 1rem;
  > ${Flex} {
    &:first-child {
      background-color: #3ed3dd;
    }
  }
  > ${Grid} {
    > ${Flex} {
      padding: 10px;
      &:first-child {
        border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
      }
    }
  }
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`
const Stake: React.FC = () => {
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  let { data: farmsData } = useStakes()
  console.log({ ' 数据': farmsData })
  useStakeWithUserData()

  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const cakeVaultContract = useCakeVaultContract()
  const handleConfirmClick = async () => {
    // setPendingTx(true)
    try {
      const tx = await callWithGasPrice(cakeVaultContract, 'harvest', undefined, { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
        // setPendingTx(false)
        // onDismiss()
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      // setPendingTx(false)
    }
  }

  // search feature
  const [searchQuery, setSearchQuery] = useState('')
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    farmsData = farmsData.filter((token) => token.token.symbol.toLowerCase().includes(lowercaseQuery))
  }

  // sort feature
  const huskyPrice = useHuskyPrice()
  const [sortOption, setSortOption] = useState('hot')
  const handleSortOptionChange = (option) => {
    setSortOption(option.value)
  }
  const sortPools = (dataToSort) => {
    switch (sortOption) {
      case 'apy':
        return orderBy(
          dataToSort,
          (token) => (token.totalToken ? getStakeApy(token, huskyPrice).apy : 0),
          'desc',
        )
      case 'total_supply':
        return orderBy(dataToSort, (token) => (token.totalToken ? parseFloat(token.totalToken) : 0), 'desc')

      case 'total_huski_rewards':
        return orderBy(
          dataToSort,
          (token) =>
            token.userData.earnings
              ? new BigNumber(parseFloat(token?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL).toFixed(3)
              : 0,
          'desc',
        )

      default:
        return dataToSort
    }
  }

  farmsData = sortPools(farmsData)
  let reward = 0
  farmsData.map((farm) => {
    const earnings = new BigNumber(parseFloat(farm?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    reward += earnings
    return reward
  })

  const { balance } = useTokenBalance(getHuskiAddress())
  const alpacaBalance = balance ? balance.dividedBy(BIG_TEN.pow(18)) : BIG_ZERO

  let remainingLockedAmount = 0
  farmsData.map((farm) => {
    remainingLockedAmount = new BigNumber(parseFloat(farm?.userData?.unlockedRewards))
      .div(DEFAULT_TOKEN_DECIMAL)
      .toNumber()
    return remainingLockedAmount
  })

  let unlockedRewards = 0
  farmsData.map((farm) => {
    unlockedRewards = new BigNumber(parseFloat(farm?.userData?.unlockedRewards)).div(DEFAULT_TOKEN_DECIMAL).toNumber()
    return unlockedRewards
  })

  return (
    <Page>
      <Box>
        <Text fontSize="3" fontWeight="bold">
          Your Rewards Summary
        </Text>
        <RewardsSummarySection padding="10px 8px 0 32px">
          <Flex flex="1" padding="1rem" borderRadius="20px" justifyContent="space-between">
            <Box>
              <Text>Huski earned:</Text>
              {reward ? <Text>{reward.toPrecision(3)}</Text> : <Skeleton width="80px" height="16px" />}
            </Box>
            <Flex position="relative">
              <ImageContainer>
                <img src={husky2} alt="" />
              </ImageContainer>
            </Flex>
          </Flex>
          <Grid flexDirection="column" flex="1">
            <Flex justifyContent="space-between">
              <Flex flexDirection="column">
                <Text>Your HUSKI Wallet Balance</Text>
                {alpacaBalance ? (
                  <Text>{alpacaBalance.toNumber().toPrecision(3)}</Text>
                ) : (
                  <Skeleton width="80px" height="16px" />
                )}
              </Flex>
              <Flex flexDirection="column">
                <Text>Remaining Locked Amount</Text>
                <Text>{remainingLockedAmount.toPrecision(3)}</Text>
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Unlocked Rewards</Text>
              <Text>{unlockedRewards.toPrecision(3)}</Text>
              <StyledButton onClick={handleConfirmClick}>Claim</StyledButton>
            </Flex>
          </Grid>
        </RewardsSummarySection>
      </Box>

      <StakeTable stakeData={farmsData} />
    </Page>
  )
}

export default Stake
