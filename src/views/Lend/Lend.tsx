import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useFarms } from 'state/farms/hooks'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Box } from '@pancakeswap/uikit'
import { ChainId, Currency } from '@pancakeswap/sdk'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import { useLendData, useLendTotalSupply } from 'state/lend/hooks'
import { useLevarageFarms, usePollLevarageFarmsWithUserData } from 'state/levarage/hooks'
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

const Lend: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const { account } = useActiveWeb3React()
const currency: Currency = {
  decimals:18,
  name:'BNB',
  symbol: 'BNB'
}
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const { lendData } = useLendData()
  console.log({ lendData, 'A':selectedCurrencyBalance  })
  const lendTotalSupply = useLendTotalSupply()
  const { data: farmsData } = useLevarageFarms()
  console.log({ 'farm 数据':farmsData })
  getAprData(farmsData[0]);
  usePollLevarageFarmsWithUserData()
  return (
    <Page>
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
            <span>${lendTotalSupply}</span>
          </StyledBox>
          <ImageContainer style={{ position: 'absolute', right: '-35px' }}>
            <img src={bone1} alt="" />
          </ImageContainer>
        </StyledFlex>
      </Flex>

      <Title>Lending Positions</Title>
      <TableWrapper>
        <TopTable data={lendData} />

        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </TableWrapper>

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

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
