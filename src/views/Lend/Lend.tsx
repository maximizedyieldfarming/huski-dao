/* eslint-disable no-unused-expressions */
import React from 'react'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useLendTotalSupply } from 'state/lend/hooks'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useTranslation } from 'contexts/Localization'
import LendTable from './components/LendTable/LendTable'

const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  gap: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  flex-flow: row wrap;
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
`

const Lend: React.FC = () => {
  const { t } = useTranslation()
  const lendTotalSupply = useLendTotalSupply()
  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })
  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()
  const volume24 = undefined

  return (
    <Page>
      <Section>
        <Box className="block" />
        <Box className="container">
          <Text color="textSubtle">{t(`Total Volume 24H:`)}</Text>
          {volume24 ? (
            <Text fontSize="30px" color="secondary">
              {volume24}
            </Text>
          ) : (
            <Skeleton width="180px" height="30px" />
          )}
          <Text fontSize="30px">{volume24}</Text>
        </Box>
        <Box className="container">
          <Text color="textSubtle">{t('Total Value Locked:')}</Text>
          {lendTotalSupply ? (
            <Text fontSize="30px" color="secondary">{`$${lendTotalSupply}`}</Text>
          ) : (
            <Skeleton width="180px" height="30px" />
          )}
        </Box>
      </Section>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
