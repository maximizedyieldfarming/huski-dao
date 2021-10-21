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
  useMatchBreakpoints,
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

const ImageContainer = styled.figure``

const StyledBox = styled(Flex)`
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  // flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 10px 30px;
  span:last-child {
    font-size: 2rem;
  }
  > .imgContainer {
    position: absolute;
    // left: -40px;
    transform: translate(-100%, 0);
  }
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
  const lendTotalSupply = useLendTotalSupply()
  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.poolId] ? '' : (hash[next.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })

  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <Page>
      <TopSection>
        <StyledBox>
          {!(isMobile || isTablet) && (
            <Box className="imgContainer">
              <img src={bone2} alt="" />
            </Box>
          )}
          <Box>
            <Text>Volume 24H:</Text>
            {/* lendTotalSupply ? <Text fontSize="30px">${lendTotalSupply}</Text> : <Skeleton width="180px" height="30px" /> */}
            <Skeleton width="180px" height="30px" />
          </Box>
        </StyledBox>
        <StyledBox>
          <Box>
            <Text>Total Value Locked:</Text>
            {lendTotalSupply ? (
              <Text fontSize="30px">{`$${lendTotalSupply}`}</Text>
            ) : (
              <Skeleton width="180px" height="30px" />
            )}
          </Box>
        </StyledBox>
      </TopSection>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
