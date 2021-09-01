import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Box, Table } from '@pancakeswap/uikit'
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
import { useFarms } from 'state/farms/hooks'
import husky2 from './assets/husky2.png'
import huskyIcon from './assets/avatar1x.png'

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
  flex-grow: 1;
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
  flex-direction: column;
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
  border-bottom: 1px solid #ccc;
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

const Stake: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const { data: farmData } = useFarms()
  console.log({ farmData })

  const [firstToken, ...rest] = farmData

  return (
    <CustomPage>
      <SingleTableWrapper>
        <Title>Lending Positions</Title>
        <Flex width="100%" borderBottom="1px solid #ccc">
          <FakeTable>
            <FakeTableHeader>
              <span>Currency</span>
              <span>APY</span>
              <span>hToken</span>
              <span>Asset Value</span>
            </FakeTableHeader>
            <FakeTableRow>
              <span>{firstToken.lpSymbol}</span>
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
        </Flex>
        <Flex justifyContent="space-between" paddingTop="1rem">
          <Flex alignItems="center">
            <ImageContainer>
              <img src={huskyIcon} alt="" />
            </ImageContainer>{' '}
            <span>Huski Rewards</span>
          </Flex>
          <span style={{ color: '#9615E7', fontSize: '30px' }}>826.23</span>
          <StyledButton>Claim</StyledButton>
        </Flex>
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
            <span>Action</span>
          </FakeTableHeader>
          {rest.map((token) => (
            <FakeTableRow key={token.pid}>
              <span>{token?.lpSymbol}</span>
              <span>{token?.pid}</span>
              <span>{token?.pid}</span>
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

export default Stake
