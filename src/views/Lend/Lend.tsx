/* eslint-disable no-unused-expressions */
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useFarms } from 'state/farms/hooks'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Text,
  Button,
  ArrowForwardIcon,
  Flex,
  Box,
  Skeleton,
} from '@pancakeswap/uikit'
import { ChainId, Currency } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { useLendTotalSupply } from 'state/lend/hooks'
import {
  useLeverageFarms,
  usePollLeverageFarmsWithUserData,
  useHuskyPrice,
  useHuskyPerBlock,
} from 'state/leverage/hooks'
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
import ERC20_INTERFACE from 'config/abi/erc20'
import { useAllTokens } from 'hooks/Tokens'
import { useMulticallContract } from 'hooks/useContract'
import { isAddress } from 'utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from 'state/multicall/hooks'
import useTokenBalance from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import { deposit } from 'utils/vaultService'
import { Field } from '../../state/mint/actions'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { ROUTER_ADDRESS } from '../../config/constants'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import husky from './assets/husky@1x.png'
import husky2 from './assets/husky2@1x.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'
import LendTable from './components/LendTable/LendTable'
import TopTable from './components/TopTable/TopTable'
import { getAprData } from './helpers'
import ToggleView, { ViewMode } from './components/ToggleView/ToggleView'
import LendCard from './components/LendCard/LendCard'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`
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
  margin: 1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  > div:first-child {
    flex-grow: 1;
  }
  > div:nth-child(2) {
    flex-basis: 20%;
  }
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`

const ActionCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ImageContainer = styled.figure``

const StyledBox = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 10px;
  span:last-child {
    font-size: 2rem;
  }
`

const Title = styled.div`
  color: #9615e7;
  font-size: 1.5rem;
  font-weight: bold;
`

const StyledButton = styled(Button)`
  padding: 0.75rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
  word-break: initial;
`
const StyledFlex = styled(Flex)`
  flex-direction: row;
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  padding: 5px 2rem;
`

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`
const TopSection = styled(Flex)`
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-end;
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
  }
`

const Lend: React.FC = () => {
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'pancake_pool_view' })
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { account } = useActiveWeb3React()
  const lendTotalSupply = useLendTotalSupply()
  console.log({ lendTotalSupply })
  const { data: farmsData } = useLeverageFarms()
  console.log({ 'farm 数据': farmsData })
  const hash = {}
  let lendData = farmsData.reduce((cur, next) => {
    hash[next.poolId] ? '' : (hash[next.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })

  usePollLeverageFarmsWithUserData()
  const cardLayout = (
    <CardLayout>
      {lendData.map((token) => (
        <LendCard token={token} key={token?.pid} />
      ))}
    </CardLayout>
  )

  // search feature
  const [searchQuery, setSearchQuery] = useState('')
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }
  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    lendData = lendData.filter((token) => token.token.symbol.toLowerCase().includes(lowercaseQuery))
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
          (token) => (token.totalToken ? getAprData(token, huskyPrice, huskyPerBlock).apy.toFixed(4) : 0),
          'desc',
        )
      case 'total_supply':
        return orderBy(dataToSort, (token) => (token.totalToken ? parseInt(token.totalToken) : 0), 'desc')

      case 'total_borrowed':
        return orderBy(dataToSort, (token) => (token.vaultDebtVal ? parseInt(token.vaultDebtVal) : 0), 'desc')
      case 'utilization_rate':
        return orderBy(
          dataToSort,
          (token) =>
            token.vaultDebtVal && token.totalToken
              ? token.totalToken > 0
                ? token.vaultDebtVal / token.totalToken
                : 0
              : 0,
          'desc',
        )
      case 'balance':
        return orderBy(
          dataToSort,
          (token) => (token.userData.tokenBalance ? parseInt(token.userData.tokenBalance) : 0),
          'desc',
        )
      default:
        return dataToSort
    }
  }

  lendData = sortPools(lendData)

  return (
    <Page>
      <TopSection>
        <StyledBox>
          <Text>Volume 24H:</Text>
          {/* lendTotalSupply ? <Text fontSize="30px">${lendTotalSupply}</Text> : <Skeleton width="180px" height="30px" /> */}
          <Skeleton width="180px" height="30px" />
        </StyledBox>
        <StyledBox>
          <Text>Total Value Locked:</Text>
          {lendTotalSupply ? <Text fontSize="30px">${lendTotalSupply}</Text> : <Skeleton width="180px" height="30px" />}
        </StyledBox>
      </TopSection>

      <Flex alignSelf="flex-end" alignItems="center">
        {/* <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} /> */}
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
              label: 'Total Borrowed',
              value: 'total_borrowed',
            },
            {
              label: 'Utilization Rate',
              value: 'utilizatoin_rate',
            },
            {
              label: 'Balance',
              value: 'balance',
            },
          ]}
          onChange={handleSortOptionChange}
        />
      </Flex>
      {viewMode === ViewMode.CARD ? cardLayout : <LendTable lendData={lendData} />}
    </Page>
  )
}

export default Lend
