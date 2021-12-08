import React, { useState, useCallback } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon, Input } from 'husky-uikit1.0'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets'
import { getDecimalAmount, getBalanceAmount } from 'utils/formatBalance'
import { usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import useTokenBalance, { useGetBnbBalance } from 'hooks/useTokenBalance'
import useTheme from 'hooks/useTheme'
import { formatDisplayedBalance } from 'utils/formatDisplayedBalance'
import styled from 'styled-components'
import Page from '../../../../components/Layout/Page'

// interface DepositProps {
//   balance: any
//   name: string
//   allowance: any
//   exchangeRate: any
//   account: any
//   tokenData: any
// }

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items: center;
`
const Section = styled(Flex)`
  background-color: #f7f7f8;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.card};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: center;
  height:100%;
  ${Box} {
    padding: 0 5px;
    &:first-child {
     // border-right: 2px solid ${({ theme }) => theme.colors.text};
    }

    &:last-child {
      // border-left: 1px solid purple;
    }
  }
`
const StyledArrowDown = styled(ArrowDownIcon)`
  fill: ${({ theme }) => theme.colors.text};
  width: 20px;
  height: 13px;
  path {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 20px;
  }
`

const Withdraw = ({ name, exchangeRate, account, tokenData, allowance, userTokenBalanceIb }) => {
  usePollLeverageFarmsWithUserData()
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number | string>()
  const history = useHistory()

  const setAmountToMax = () => {
    setAmount(userTokenBalanceIb)
  }

  const { toastError, toastSuccess, toastInfo } = useToast()
  const { vaultAddress } = tokenData.TokenInfo
  const withdrawContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const assetsReceived = new BigNumber(amount)
    .times(exchangeRate)
    .toFixed(tokenData?.TokenInfo?.token?.decimalsDigits, 1)
  const [isPending, setIsPending] = useState<boolean>(false)
  const { isDark } = useTheme()

  // const { balance: tokenBalance } = useTokenBalance(tokenData.TokenInfo.vaultAddress)
  // const [userTokenBalanceIb, setBalance] = useState(
  //   getBalanceAmount(tokenBalance).isNaN() ? 0.0 : getBalanceAmount(tokenBalance).toJSON(),
  // )

  const handleAmountChange = useCallback(
    (event) => {
      // check if input is a number and includes decimals and allow empty string
      if (event.target.value.match(/^[0-9]*[.,]?[0-9]{0,18}$/)) {
        const input = event.target.value
        const finalValue = Number(input) > Number(userTokenBalanceIb) ? userTokenBalanceIb : input
        setAmount(finalValue)
      } else {
        event.preventDefault()
      }
    },
    [userTokenBalanceIb, setAmount],
  )

  const handleConfirm = () => {
    toastInfo(t('Pending Transaction...'), t('Please Wait!'))
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleWithdrawal(convertedStakeAmount)
  }

  const callOptions = {
    gasLimit: 380000,
  }

  const handleWithdrawal = async (convertedStakeAmount: BigNumber) => {
    setIsPending(true)
    // .toString() being called to fix a BigNumber error in prod
    // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
    try {
      const tx = await callWithGasPrice(withdrawContract, 'withdraw', [convertedStakeAmount.toString()], callOptions)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your withdraw was successfull'))
      }
    } catch (error) {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  const balance = formatDisplayedBalance(userTokenBalanceIb, tokenData.TokenInfo?.token?.decimalsDigits)

  return (
    <Page style={{ padding: 0 }}>
      <Flex flexDirection="column">
        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" color="textFarm" fontSize="14px">
            {t('From')}
          </Text>
          <Text fontSize="12px">
            {t('Balance')}: <span style={{ fontWeight: 700 }}>{`${balance} ${name}`}</span>
          </Text>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }}>
          <Box>
            <Input
              pattern="^[0-9]*[.,]?[0-9]{0,18}$"
              placeholder="0.00"
              onChange={handleAmountChange}
              value={amount}
              style={{ background: "transparent", border: "none" }}
            />
          </Box>
          <Box>
            <MaxContainer>
              <Box>
                <button
                  type="button"
                  style={{
                    borderRadius: '8px',
                    border: '1px solid #DDDFE0',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={setAmountToMax}
                >
                  <Text>{t('MAX')}</Text>
                </button>
              </Box>
              <img src="/images/BNB.svg" style={{ marginLeft: '20px', marginRight: '15px' }} width="40px" alt="" />
              <Box>
                <Text color="textFarm" style={{ fontWeight: 700 }}>
                  {name}
                </Text>
              </Box>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <Flex flexDirection="column">
        <StyledArrowDown style={{ marginLeft: 'auto', marginRight: 'auto' }} />

        <Flex justifyContent="space-between" mb="10px">
          <Text fontWeight="700" color="textFarm" fontSize="14px">
            {t('Recieve (Estimated)')}
          </Text>
          <Text  fontSize="12px">
            {t('Balance')}: <span style={{ fontWeight: 700 }}>{`${balance} ${name}`}</span>
          </Text>
        </Flex>
        <Section justifyContent="space-between" style={{ background: isDark ? '#111315' : '#F7F7F8' }}>
          <Box>
            <Text style={{ backgroundColor: 'transparent', fontSize: '28px', fontWeight: 700 }}>
              {assetsReceived !== 'NaN' ? assetsReceived : 0}
            </Text>
          </Box>
          <Box>
            <MaxContainer>
              <img src="/images/BNB.svg" style={{ marginLeft: '20px', marginRight: '15px' }} width="40px" alt="" />
              <Box>
                <Text color="textFarm" style={{ fontWeight: 700 }}>ib{name}</Text>
              </Box>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="row" justifySelf="flex-end" justifyContent="space-evenly" mb="20px" mt="30px">
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }}>
          <img src="/images/Cheveron.svg" alt="" />
          <Text color="textSubtle" fontWeight="bold" fontSize="16px" style={{ height: '100%' }}
            onClick={() => history.goBack()}
          >
            {t('Back')}
          </Text>
        </Flex>

        <Button
          style={{ width: '160px', height: '57px', borderRadius: '16px' }}
          onClick={handleConfirm}
          disabled={
            !account ||
            Number(userTokenBalanceIb) === 0 ||
            Number(amount) === 0 ||
            amount === undefined ||
            isPending ||
            exchangeRate.isNaN()
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button>

      </ButtonGroup>
    </Page>
  )
}

export default Withdraw
