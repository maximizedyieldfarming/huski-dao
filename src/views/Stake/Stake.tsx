import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Box } from '@pancakeswap/uikit'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
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
import { useFarms } from 'state/farms/hooks'
import husky2 from './assets/husky2.png'
import huskyIcon from './assets/avatar1x.png'
import StakeTable from './components/StakeTable/StakeTable'

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
  figure {
    display: none;
    @media (min-width: 1024px) {
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

const CustomPage = styled(Page)`
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  margin-right: 5%;
  max-width: none;
`

const StyledTable = styled(Table)`
  tr {
    @media screen and (max-width: 40rem) {
      border-top: 0 !important;
      border-left: 0 !important;
      border-right: 0 !important;
      border-bottom: 1px solid #000 !important;
      &:last-child {
        border-bottom: none !important;
      }
    }

    &:not(:last-child) {
      border-bottom: 1px solid #9604e11a;
    }

    th,
    td {
      padding: 0.5rem;
      vertical-align: middle;
      font-weight: 400;
      &:not(:first-child) {
        word-break: break-word;
        text-align: center;
      }
      @media screen and (max-width: 40rem) {
        &.pivoted {
          &:not(:last-child) {
            border-bottom: 1px solid #9604e11a !important;
          }
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
  }
`

const Stake: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const { stakeData } = useStakeData()
  const { stakeBalanceData } = useStakeBalanceData()

  const stakingData = stakeData.map((value, index) => {
    return { ...value, huskyDaily: stakeBalanceData[index] }
  })

  console.log({ stakingData })

  return (
    <CustomPage>
      <SingleTableWrapper>
        <Title>Positions</Title>
        <Flex width="100%" borderBottom="1px solid #ccc">
          <StyledTable style={{ border: 'none' }}>
            <Thead>
              <Tr>
                <Th>Currency</Th>
                <Th>APY</Th>
                <Th>hToken</Th>
                <Th>Asset Value</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{stakingData[0]?.name}</Td>
                <Td>{}</Td>
                <Td>{}</Td>
                <Td>{}</Td>
                <Td>
                  <ActionCell>
                    <StyledButton>Deposit</StyledButton>
                    <StyledButton>Withdraw</StyledButton>
                  </ActionCell>
                </Td>
              </Tr>
            </Tbody>
          </StyledTable>
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
          <Text as="span" style={{ color: '#9615E7', fontSize: '30px' }}>
            826.23
          </Text>
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

      <StakeTable stakeData={stakingData} />

      {/* <TableWrapper>
        <StyledTable>
          <Thead>
            <Tr>
              <Th>Currency</Th>
              <Th>APR</Th>
              <Th>Total Supply</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stakingData.map((token) => (
              <Tr>
                <Td>{token?.name}</Td>
                <Td>{token?.stakeAPR}</Td>
                <Td>{new BigNumber(token?.stakeValue).toExponential(3)}</Td>
                <Td>
                  <ActionCell>
                    <StyledButton>Deposit</StyledButton>
                    <StyledButton>Withdraw</StyledButton>
                  </ActionCell>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </StyledTable>
      </TableWrapper> */}
    </CustomPage>
  )
}

export default Stake
