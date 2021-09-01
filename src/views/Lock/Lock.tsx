import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text, Button, ArrowForwardIcon, Flex, Box } from '@pancakeswap/uikit'
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
const StyledBox = styled(Box)`
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  flex: 1;
`
const Container = styled(Box)`
  background-color: #fff;
  border-radius: 20px;
  border-top: 3px solid #9615e7;
  padding: 1rem;
  color: #9615e7;
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #9615e7;
`

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <Page>
      <Flex style={{ gap: '1rem' }}>
        <StyledBox>
          <Flex justifyContent="space-between">
            <Text color="#9615E7">Husky Total Supply</Text>
            <Text color="#9615E7" fontSize="30px" fontWeight="bold">
              123456789
            </Text>
          </Flex>
        </StyledBox>
        <StyledBox>
          <Flex justifyContent="space-between">
            <Text color="#9615E7">Husky TVL</Text>
            <Text color="#9615E7" fontSize="30px" fontWeight="bold">
              123456789
            </Text>
          </Flex>
        </StyledBox>
      </Flex>
      <Container>
        <Header>
          <Text color="#9615E7">Huski Lock</Text>
          <Flex alignItems="center">
            <Text color="#9615E7">APY</Text>
            <Text color="#FB646B" fontSize="30px">
              236
            </Text>
          </Flex>
        </Header>
        <Flex>
          <Box style={{ flex: '1' }}>
            <Box>
              <Text color="#9617e7">Totall Volume Locked</Text>
              <Text color="#FC9B02">1774</Text>
            </Box>
          </Box>
          <Box style={{ flex: '1' }}>
            <Box>
              <Text color="#9617e7">Totall Volume Locked</Text>
              <Text color="#FC9B02">1774</Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Page>
  )
}

export default Farms
