import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useCakeVaultContract } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { Image, Text, Button, Flex, Box } from '@pancakeswap/uikit'
import { useStakeBalanceData, useStakeData } from 'state/stake/hooks'
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
import husky2 from './assets/husky2.png'
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

const SingleTableWrapper = styled(TableWrapper)`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
  > ${Flex} {
    > div {
      flex: 1;
    }
  }
  figure {
    display: none;
    ${({ theme }) => theme.mediaQueries.xl} {
      display: block;
    }
  }
`

const ActionCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ImageContainer = styled.figure``

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
  height: auto;
  box-shadow: none;
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`
const Stake: React.FC = () => {
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const { stakeData } = useStakeData()
  const { stakeBalanceData } = useStakeBalanceData()

  const stakingData = stakeData.map((value, index) => {
    return { ...value, huskyDaily: stakeBalanceData[index] }
  })
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
      {stakingData.map((token) => (
        <StakeCard token={token} />
      ))}
    </CardLayout>
  )
  console.log('useStakeData', useStakeData())
  console.log({ stakingData })
  console.log({ stakeBalanceData })
  return (
    <Page>
      <SingleTableWrapper>
        <Title>Positions</Title>
        <Flex width="100%" alignItems="center">
          <Box>
            <TopTable data={stakingData} />
            <Flex
              justifyContent="space-between"
              alignItems="center"
              padding="10px 8px 0 32px"
              borderTop="1px solid #ccc"
            >
              <Flex alignItems="center">
                <ImageContainer>
                  <img src={huskyIcon} alt="" />
                </ImageContainer>
                <Text>Huski Rewards</Text>
              </Flex>
              <Text as="span" fontSize="30px">
                1234
              </Text>
              <StyledButton onClick={handleConfirmClick}>Claim</StyledButton>
            </Flex>
          </Box>

          <ImageContainer>
            <img src={husky2} alt="" />
          </ImageContainer>
        </Flex>
      </SingleTableWrapper>

      <Flex alignSelf="flex-end">
        <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
        <Select
          options={[
            {
              label: 'Anual Income',
              value: 'anual_income',
            },
            {
              label: 'APR',
              value: 'apr',
            },
            {
              label: 'Multiplier',
              value: 'multiplier',
            },
            {
              label: 'Earned',
              value: 'earned',
            },
            {
              label: 'Liquidity',
              value: 'liquidity',
            },
          ]}
        />
      </Flex>

      {viewMode === ViewMode.CARD ? cardLayout : <StakeTable stakeData={stakingData} />}
    </Page>
  )
}

export default Stake
