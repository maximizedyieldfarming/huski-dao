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
  earnings: number
}

interface LocationState {
  positionFarmsData: any
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

const Rewards: React.FC<RewardsProps> = ({ name, earnings }) => {
  const { t } = useTranslation()
  const [isPending, setIsPending] = useState(false)

  const rewards = new BigNumber(earnings).div(DEFAULT_TOKEN_DECIMAL).toNumber()

  return (
    <Cell>
      <Text>{t(`Rewards from positions on ${name} pairs`)}</Text>
      <Box>
        <Text color="textSubtle">{t('HUSKI Earned')}</Text>
        <Text bold>{rewards.toPrecision(4)}</Text>
      </Box>
      <Button
        disabled={isPending}
        isLoading={isPending}
        endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
      >
        {isPending ? t('Claiming') : t('Claim')}
      </Button>
    </Cell>
  )
}

const Claim: React.FC = () => {
  const { t } = useTranslation()
  const {
    state: { positionFarmsData, farmsData },
  } = useLocation<LocationState>()
  console.log({ positionFarmsData, farmsData })

  /* const cells = farmsData.filter(
    (pool, index, array) => array.findIndex((pools) => pools.token.symbol === pool.token.symbol) === index,
  ) */
  const positionsWithEarnings = positionFarmsData.filter((pool) => Number(pool?.farmData?.userData?.farmEarnings) > 0)

  console.log({ positionsWithEarnings })

  const rewards = []
  positionsWithEarnings.forEach((pool, index) => {
    if (pool?.farmData?.token?.symbol === positionsWithEarnings[index + 1]?.farmData?.token?.symbol) {
      const sum =
        Number(pool?.farmData?.userData?.farmEarnings) +
        Number(positionsWithEarnings[index + 1]?.farmData?.userData?.farmEarnings)
      rewards.push({
        name: pool?.farmData?.token?.symbol,
        earnings: sum,
      })
    }
  })

  console.log({ rewards })

  // start farm page : claim
  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const claimContract = useClaimFairLaunch()
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleConfirm = async () => {
    // try {
    //   const tx = await callWithGasPrice(claimContract, 'harvest', [这里要用debtPoolId], { gasLimit: 300000 })
    //   const receipt = await tx.wait()
    //   if (receipt.status) {
    //     toastSuccess(t('Bounty collected!'), t('CAKE bounty has been sent to your wallet.'))
    //   }
    // } catch (error) {
    //   toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    // }
  }
  // end

  return (
    <Page>
      <Text bold mx="auto">
        {t('Harvest')}
      </Text>
      <Wrapper>
        {positionsWithEarnings.map((pool) => (
          <Rewards
            name={pool?.farmData?.token?.symbol}
            earnings={Number(pool?.farmData?.userData?.farmEarnings)}
            key={pool?.pid}
          />
        ))}
      </Wrapper>
    </Page>
  )
}

export default Claim
