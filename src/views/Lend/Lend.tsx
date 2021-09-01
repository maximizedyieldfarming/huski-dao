import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useFarms } from 'state/farms/hooks'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Box } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import {
  loadBloackchainData,
  useLendData,
  useStakeData,
  usePriceCakeBusd,
  usesumLendingPoolData,
  loadStakeData,
  getStakeData,
  getpoolHuskyDaily,
} from 'state/lend/hooks'
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
import husky from './assets/husky@1x.png'
import husky2 from './assets/husky2.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'

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
const FakeTable = styled.div`
  background-color: #fff;
  border-radius: 1rem;
`

const FakeTableRow = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`
const FakeTableHeader = styled(FakeTableRow)`
  &:not(:last-child) {
    border-bottom: none;
  }
`

const TableWrapper = styled.div`
  background-color: #fff;
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
`

const SingleTableWrapper = styled(TableWrapper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  > div:first-child {
    flex-basis: 20%;
  }
  > div:nth-child(2) {
    flex-grow: 1;
  }
`

const ActionCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ImageContainer = styled.figure``

const StyledBox = styled(Box)`
  background-color: #fff;
  color: #9615e7;
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
  font-size: 36px;
`

const StyledButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const StyledFlex = styled(Flex)`
  flex-direction: row;
  position: relative;
  background-color: #fff;
  padding: 5px 2rem;
`

const CustomPage = styled(Page)`
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  margin-right: 5%;
  max-width: none;
`

const Lend: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  // loadBloackchainData()
  const { lendData } = useLendData()
  console.info({ lendData })
  const { stakeData } = useStakeData()
  console.info('112333', stakeData)

  // loadStakeData()
  // getStakeData()
  // getpoolHuskyDaily()
  // usePriceCakeBusd();
  // usesumLendingPoolData();


  return (
    <CustomPage>
      <Flex justifyContent="space-between" marginBottom="1rem" alignItems="center">
        <ImageContainer>
          <img src={husky} alt="" />
        </ImageContainer>
        <StyledFlex flexDirection="row" borderRadius="20px">
          <ImageContainer style={{ position: 'absolute', left: '-35px' }}>
            <img src={bone2} alt="" />
          </ImageContainer>
          <StyledBox>
            <span>Total Supply</span>
            <span>$1234567890</span>
          </StyledBox>
          <ImageContainer style={{ position: 'absolute', right: '-35px' }}>
            <img src={bone1} alt="" />
          </ImageContainer>
        </StyledFlex>
      </Flex>

      <SingleTableWrapper>
        <Title>Lending Positions</Title>
        <FakeTable>
          <FakeTableHeader>
            <span>Currency</span>
            <span>APY</span>
            <span>Deposit</span>
            <span>Yield</span>
            <span>hToken</span>
            <span>Action</span>
          </FakeTableHeader>
          <FakeTableRow>
            <span>{lendData[0]?.name}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <ActionCell>
              <StyledButton>Deposit</StyledButton>
              <StyledButton>Withdraw</StyledButton>
            </ActionCell>
          </FakeTableRow>
        </FakeTable>
        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </SingleTableWrapper>

      <Flex alignSelf="flex-end">
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

      <TableWrapper>
        <FakeTable>
          <FakeTableHeader>
            <span>Currency</span>
            <span>APR</span>
            <span>Total Supply</span>
            <span>Total Borrowed</span>
            <span>Utilization Rate</span>
            <span>Balance</span>
            <span>Action</span>
          </FakeTableHeader>
          {lendData.map((token) => (
            <FakeTableRow key={lendData.indexOf(token)}>
              <span>{token?.name}</span>
              <span>{token?.landApr}</span>
              <span>{token?.totalDeposit}</span>
              <span>{token?.totalBorrowed}</span>
              <span>{token?.capitalUtilizationRate}</span>
              <span>{token?.exchangeRate}</span>
              <ActionCell>
                <StyledButton>Deposit</StyledButton>
                <StyledButton>Withdraw</StyledButton>
              </ActionCell>
            </FakeTableRow>
          ))}
        </FakeTable>
      </TableWrapper>
    </CustomPage>
  )
}

export default Lend

// TODO: CREATE a proper table components/elements (创建一个合适的表格组件/元素)
