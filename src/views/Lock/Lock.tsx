import React from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { Text, Button, Flex, Box, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { getsHuskiAddress } from 'utils/addressHelpers'
import { useStakeWithUserData, useStakes } from 'state/stake/hooks'
import useTokenBalance from 'hooks/useTokenBalance'
import { WalletIcon } from 'assets'
import LockTable from './components/LockTable/LockTable'

const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 1rem;
  gap: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  .container {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
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
  const { t } = useTranslation()
  const { data: farmsData } = useStakes()
  useStakeWithUserData()
 
  const lockData = farmsData.filter((f) => f.pid === 5)
  const { balance } = useTokenBalance(getsHuskiAddress())
  const sHuskiBalance = Number(balance)/10**18 // balance ? balance.dividedBy(BIG_TEN.pow(18)) : BIG_ZERO

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
          {volumeLocked ? <Text color="secondary">{`$${volumeLocked}`}</Text> : <Skeleton width="80px" height="16px" />}
        </Box>
      </Section>
      <Flex>
        <Section className="balanceWrapper">
          <Flex alignItems="center">
            <Flex>
              <WalletIcon width="24px" height="24px" color="gold" />
              <Text>{t('My sHUSKI Balance')}</Text>
            </Flex>
            <Text>{sHuskiBalance}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text>{t('Redeem your sHUSKI for HUSKI')}</Text>
            <Button scale="sm" disabled={!sHuskiBalance}>
              {t('Approve & Redeem')}
            </Button>
          </Flex>
        </Section>
      </Flex>
      <LockTable data={lockData} />
    </Page>
  )
}

export default Lock
