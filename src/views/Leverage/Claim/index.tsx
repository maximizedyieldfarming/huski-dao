/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Button, AutoRenewIcon } from 'husky-uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import { useLocation } from 'react-router-dom'
import { useClaimFairLaunch } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'utils/config'

interface RewardsProps {
  name: string
  debtPoolId: number
  earnings: number
  token: any
}

interface LocationState {
  farmsData: any
}

const Wrapper = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 1rem;

  // justify-content: space-between;
  // align-content: space-between;
  // align-items: center;
  // margin: 0 auto;
`
const Cell = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  gap: 1rem;
  justify-content: space-between;
`

const Rewards: React.FC<RewardsProps> = ({ name, earnings, token, debtPoolId }) => {
  const { t } = useTranslation()
  const [isPending, setIsPending] = useState(false)

  const rewards = new BigNumber(earnings).div(DEFAULT_TOKEN_DECIMAL).toNumber()
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const claimContract = useClaimFairLaunch()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(claimContract, 'harvest', [debtPoolId], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Bounty collected!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Cell>
      <Flex alignItems="center" flex="2">
        <TokenImage token={token} width={30} height={30} mr="8px" />
        <Box>
          <Text>{t(`Rewards from positions on ${name} pairs`)}</Text>
        </Box>
      </Flex>
      <Box style={{ flex: '1' }}>
        <Text>{t('HUSKI Earned')}</Text>
        <Text bold color="secondary">
          {rewards.toPrecision(4)}
        </Text>
      </Box>
      <Box style={{ flex: '1' }}>
        <Button
          disabled={isPending || !rewards}
          isLoading={isPending}
          onClick={handleConfirm}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Claiming') : t('Claim')}
        </Button>
      </Box>
    </Cell>
  )
}

const Claim: React.FC = () => {
  const { t } = useTranslation()
  const {
    state: { farmsData },
  } = useLocation<LocationState>()

  const hash = {}
  const positionsWithEarnings = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  const rewards = []
  positionsWithEarnings.forEach((pool, index) => {
    if (pool?.TokenInfo?.token?.symbol === positionsWithEarnings[index + 1]?.TokenInfo?.token?.symbol) {
      const sum =
        Number(pool?.userData?.farmEarnings) + Number(positionsWithEarnings[index + 1]?.userData?.farmEarnings)
      rewards.push({
        name: pool?.TokenInfo?.token?.symbol,
        earnings: sum,
        token: pool?.TokenInfo?.token,
      })
    }
  })

  return (
    <Page>
      <Text bold mx="auto" color="secondary" fontSize="2">
        {t('Harvest')}
      </Text>
      <Wrapper>
        {positionsWithEarnings.map((pool) => (
          <Rewards
            name={pool?.TokenInfo?.token?.symbol.replace('wBNB', 'BNB')}
            debtPoolId={pool?.TokenInfo?.token?.debtPoolId}
            earnings={Number(pool?.userData?.farmEarnings)}
            key={pool?.TokenInfo?.token?.debtPoolId}
            token={pool?.TokenInfo?.token}
          />
        ))}
      </Wrapper>
    </Page>
  )
}

export default Claim
