import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { CardBody as UiKitCardBody, Flex, Text, CardRibbon, Skeleton, Button, Box } from 'husky-uikit1.0'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatBigNumber } from 'state/utils'
import Select from 'components/Select/Select'
import { Card } from './Card'
import CardHeader from './CardHeader'

const CardBody = styled(UiKitCardBody)`
  .avgContainer {
    border-bottom: 1px solid ${({ theme }) => `${theme.colors.textSubtle}26`};
    padding-bottom: 0.5rem;
  }
`

const SingleAssetsCard = ({ data }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const tvl = data?.supply
  const apy = data?.marketCap
  const riskLevel = data?.change
  const dailyEarnings = data?.supplyChange
  const avgApy = 2

  return (
    <Card>
      <CardHeader data={data} />
      <CardBody>
        <Box className="avgContainer">
          <Flex>
            <Text>{t('7Days Average APY')}</Text>
            {/* <Select option=[{ }]/> */}
          </Flex>
          <Flex>
            <Box>
              <Text bold fontSize="3">
                {avgApy}%
              </Text>
              <Text>{t(`than 1x yield farm`)}</Text>
            </Box>
            {/* graph */}
          </Flex>
        </Box>
        <Box padding="0.5rem 0">
          <Flex justifyContent="space-between">
            <Text>{t('TVL')}</Text>
            <Text>{tvl}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('APY')}</Text>
            <Text>{apy}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Risk Level')}</Text>
            <Text>{riskLevel}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text>{t('Daily Earnings')}</Text>
            <Text>{dailyEarnings}</Text>
          </Flex>
        </Box>
        <Flex justifyContent="center">
          <Button
            scale="sm"
            as={Link}
            to={(location) => ({ ...location, pathname: `${location.pathname}/farm/${data?.symbol}`, state: { data } })}
            disabled={!account}
            onClick={(e) => !account && e.preventDefault()}
          >
            {t('Farm')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default SingleAssetsCard
