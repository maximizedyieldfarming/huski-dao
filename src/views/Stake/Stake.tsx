import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Image, Text, Button, Flex, Box, Skeleton, Grid } from '@pancakeswap/uikit'
import { useStakeWithUserData, useStakes, useHuskyPrice, useHuskyPerBlock } from 'state/stake/hooks'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import usePersistState from 'hooks/usePersistState'
import { Farm } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApr } from 'utils/apr'
import { orderBy } from 'lodash'
import isArchivedPid from 'utils/farmHelpers'
import { latinise } from 'utils/latinise'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import Loading from 'components/Loading'
import { getStakeApy } from 'views/Stake/helpers'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import husky2 from './assets/stake_rewards_img.png'
import huskyIcon from './assets/avatar1x.png'
import StakeTable from './components/StakeTable/StakeTable'
import TopTable from './components/TopTable/TopTable'
import StakeCard from './components/StakeCard/StakeCard'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'

const NUMBER_OF_FARMS_VISIBLE = 12

const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if (cakeRewardsApr && lpRewardsApr) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}

// styled components

const TableWrapper = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
`

const ImageContainer = styled.figure`
  // position: absolute;
  // right: -10px;
`

const Title = styled.div`
  color: #9615e7;
  font-size: 30px;
  border-bottom: 1px solid #ccc;
  @media screen and (min-width: 1024px) {
    font-size: 36px;
  }
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

  // const { stakeData } = useStakeData()
  // const { stakeBalanceData } = useStakeBalanceData()

  // const stakingData = stakeData.map((value, index) => {
  //   return { ...value, huskyDaily: stakeBalanceData[index] }
  // })
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
  const cardLayout = (
    <CardLayout>
      {farmsData.map((token) => (
        <StakeCard token={token} key={token?.pid} />
      ))}
    </CardLayout>
  )
  // console.log('useStakeData', useStakeData())
  // console.log({ stakingData })
  // console.log({ stakeBalanceData })

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
  const huskyPerBlock = useHuskyPerBlock()
  const [sortOption, setSortOption] = useState('hot')
  const handleSortOptionChange = (option) => {
    setSortOption(option.value)
  }
  const sortPools = (dataToSort) => {
    switch (sortOption) {
      case 'apy':
        return orderBy(
          dataToSort,
          (token) => (token.totalToken ? getStakeApy(token, huskyPrice, huskyPerBlock).toFixed(4) : 0),
          'desc',
        )
      case 'total_supply':
        return orderBy(dataToSort, (token) => (token.totalToken ? parseInt(token.totalToken) : 0), 'desc')

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
              <Skeleton width="80px" height="16px" />
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
                <Skeleton width="80px" height="16px" />
              </Flex>
              <Flex flexDirection="column">
                <Text>Remaining Locked Amount</Text>
                <Skeleton width="80px" height="16px" />
              </Flex>
            </Flex>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Unlocked Rewards</Text>
              <Skeleton width="80px" height="16px" />
              <StyledButton onClick={handleConfirmClick}>Claim</StyledButton>
            </Flex>
          </Grid>
        </RewardsSummarySection>
      </Box>

      <Flex alignSelf="flex-end">
        {/*         <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} /> */}
        <Flex alignItems="center" mr="10px">
          <SearchInput onChange={handleChangeQuery} placeholder="Search" />
        </Flex>
        <Select
          options={[
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'APY',
              value: 'apy',
            },
            {
              label: 'Total Supply',
              value: 'total_supply',
            },
            {
              label: 'Total HUSKI Rewards',
              value: 'total_huski_rewards',
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </Flex>

      {viewMode === ViewMode.CARD ? cardLayout : <StakeTable stakeData={farmsData} />}
    </Page>
  )
}

export default Stake
