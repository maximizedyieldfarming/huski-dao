/* eslint-disable no-unused-expressions */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Button, AutoRenewIcon } from '@huskifinance/huski-frontend-uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import { TokenImage } from 'components/TokenImage'
import { useLocation, useHistory } from 'react-router-dom'
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // justify-content: space-between;
  // align-content: space-between;
  // align-items: center;
  // margin: 0 auto;
`
const Cell = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  padding: 1rem;
  margin: 0.7rem;
  width: 100%;
  max-width: 850px;
  border-radius: ${({ theme }) => theme.radii.default};
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
      <Flex alignItems="center" width="300px">
        <TokenImage token={token} width={44} height={44} mr="8px" />
        <Box>
          <Text fontSize="12px" color="#6F767E">
            {t(`Rewards from positions on`)}
          </Text>
          <Text>{t(`${name} pairs`)}</Text>
        </Box>
      </Flex>
      <Box>
        <Text>{t('HUSKI Earned')}</Text>
        <Text bold color="secondary">
          {rewards.toPrecision(4)}
        </Text>
      </Box>
      <Box>
        <Button
          disabled={isPending || !rewards}
          isLoading={isPending}
          onClick={handleConfirm}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          width="154px"
          height="40px"
        >
          {isPending ? t('Claiming') : t('Claim')}
        </Button>
      </Box>
    </Cell>
  )
}

const Claim: React.FC = () => {
  const { t } = useTranslation()
  const history = useHistory()
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
      <Flex justifyContent="center">
        <img src="/images/harvest.png" alt="haverst" width="193px" height="75px" />
      </Flex>
      <Text bold mx="auto" fontSize="25px" mt="-30px">
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
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }} width="100%" mt="20px">
          <img src="/images/Cheveron.svg" alt="" />
          <Text
            color="textSubtle"
            fontWeight="bold"
            fontSize="16px"
            style={{ height: '100%' }}
            onClick={() => history.goBack()}
          >
            {t('Back')}
          </Text>
        </Flex>
      </Wrapper>

      <Box position="absolute" right="0px" bottom="0px">
        <img src="/images/haverstdog.png" alt="havestdog" width="300px" height="300px" />
      </Box>
    </Page>
  )
}

export default Claim
