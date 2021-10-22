import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Text,  Button, Flex, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useClaimFairLaunch } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { DEFAULT_TOKEN_DECIMAL } from 'utils/config'
import BaseCell, { CellContent } from './BaseCell'

const StyledCell = styled(BaseCell)`
  flex: 1 0 50px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1 0 120px;
  }
  > div {
    gap: 5px;
  }
  a {
    padding: 0.75rem;
    font-size: 14px;
    font-weight: 400;
    height: auto;
    box-shadow: none;
    word-break: initial;
  }
  ${CellContent} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      flex-direction: column;
    }
  }
`

const RewardsCell = ({ token }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const reward = new BigNumber(parseFloat(token?.userData?.earnings)).div(DEFAULT_TOKEN_DECIMAL).toFixed(3)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastError, toastSuccess } = useToast()
  const claimContract = useClaimFairLaunch()

  const handleConfirmClick = async () => {
    try {
      const tx = await callWithGasPrice(claimContract, 'harvest', [token.pid], { gasLimit: 300000 })
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('bounty has been sent to your wallet.'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          Total HUSKI Rewards
        </Text>
        <Flex alignItems="center" style={{ gap: '10px' }}>
          {reward ? <Text fontSize="3">{reward}</Text> : <Skeleton width="80px" height="16px" />}
          <Button disabled={!account || Number(reward) === 0} onClick={handleConfirmClick} scale="sm">
            {t('Claim1')}
          </Button>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default RewardsCell
