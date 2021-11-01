import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
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
import { ChainId } from '@pancakeswap/sdk'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import huskyIcon from './assets/avatar1x.png'
import LockTable from './components/LockTable/LockTable'

const NUMBER_OF_FARMS_VISIBLE = 12

const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 1rem;
  gap: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  .container {
    background-color: ${({ theme }) => theme.colors.textDisabled};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.textDisabled};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  &.balanceWrapper {
    gap: unset;
    > ${Flex} {
      padding: 5px 10px;
      flex-direction: column;
      gap: 10px;
      ${({ theme }) => theme.mediaQueries.lg} {
        flex-direction: row;
      }
      &:first-child {
        border-right: 1px solid ${({ theme }) => theme.colors.textDisabled};
      }
      &:last-child {
        border-left: 1px solid ${({ theme }) => theme.colors.textDisabled};
      }
    }
  }
`

const Lock: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const sHuskiBalance = null
  const volume24 = null
  const volumeLocked = null

  return (
    <Page>
      <Section>
        <Box className="block" />
        <Box className="container">
          <Text color="textSubtle">{t('Total Volume 24H')}</Text>
          {volume24 ? <Text>{volume24}</Text> : <Skeleton width="80px" height="16px" />}
        </Box>
        <Box className="container">
          <Text color="textSubtle">{t('Total Volume Locked')}</Text>
          {volumeLocked ? <Text>{volumeLocked}</Text> : <Skeleton width="80px" height="16px" />}
        </Box>
      </Section>
      <Flex>
        <Section className="balanceWrapper">
          <Flex alignItems="center">
            <Text>{t('My sHUSKI Balance')}</Text>
            {sHuskiBalance ? <Text>{sHuskiBalance}</Text> : <Skeleton width="80px" height="16px" />}
          </Flex>
          <Flex alignItems="center">
            <Text>{t('Redeem your sHUSKI for HUSKI')}</Text>
            <Button scale="sm" disabled={!sHuskiBalance}>
              {t('Approve & Redeem')}
            </Button>
          </Flex>
        </Section>
      </Flex>
      <LockTable data={null} />
    </Page>
  )
}

export default Lock
