import BigNumber from 'bignumber.js'
import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { CardBody, Flex, Text, CardRibbon } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import styled from 'styled-components'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { Pool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import StyledCardHeader from './StyledCardHeader'
import CardActions from './CardActions'

const ExpandingWrapper = styled.div`
  padding: 24px;
  border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
  overflow: hidden;
`

const LendCard = ({ token }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { account } = useWeb3React()
  const { t } = useTranslation()

  const { name, apy, totalDeposit, totalBorrowed, capitalUtilizationRate } = token

  return (
    <StyledCard>
      <StyledCardHeader
        name={name}
        /* isStaking={accountHasStakedBalance}
        earningToken={earningToken}
        stakingToken={stakingToken}
        isFinished={isFinished && sousId !== 0} */
      />
      <CardBody>
        <AprRow apy={apy} />
        <Flex mt="24px" flexDirection="column">
          {account ? (
            /*  <CardActions pool={pool} stakedBalance={stakedBalance} /> */
            { account }
          ) : (
            <>
              <Text mb="10px" textTransform="uppercase" fontSize="12px" color="textSubtle" bold>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton />
            </>
          )}
        </Flex>
      </CardBody>

      <ExpandingWrapper>
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        {showExpandableSection && (
          /*  <DetailsSection
            removed={removed}
            bscScanAddress={getBscScanLink(lpAddress, 'address')}
            infoAddress={`https://pancakeswap.info/pool/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          /> */
          <>
            <Flex justifyContent="space-between">
              <Text>Total Supply: </Text>
              <Text>{totalDeposit}</Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Text>Total Borrowed: </Text>
              <Text>{totalBorrowed}</Text>
            </Flex>

            <Flex justifyContent="space-between">
              <Text>Utilization Rate: </Text>
              <Text>{capitalUtilizationRate}</Text>
            </Flex>
          </>
        )}
      </ExpandingWrapper>
      {/*  <CardFooter pool={pool} account={account} /> */}
    </StyledCard>
  )
}

export default LendCard
