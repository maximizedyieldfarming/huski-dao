import React, { useState } from 'react'
import { Box, Button, Flex, Text, AutoRenewIcon } from 'husky-uikit1.0'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import NumberInput from 'components/NumberInput'
import { getDecimalAmount } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import { ethers } from 'ethers'
import { useVault, useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ArrowDownIcon } from 'assets'

interface DepositProps {
  balance: any
  name: any
  allowance: any
  exchangeRate: any
  account: any
  tokenData: any
  tokenName: string
}

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items:center;
`
const Section = styled(Flex)`
  background-color: #F7F7F8;
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

const Deposit: React.FC<DepositProps> = ({ balance, name, allowance, exchangeRate, account, tokenData, tokenName }) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState<number>()

  const handleAmountChange = (e) => {
    const invalidChars = ['-', '+', 'e']
    if (invalidChars.includes(e.key)) {
      e.preventDefault()
    }
    const { value } = e.target

    const finalValue = value > balance ? balance : value
    setAmount(finalValue)
  }

  const setAmountToMax = (e) => {
    setAmount(balance)
  }

  const { toastError, toastSuccess, toastInfo, toastWarning } = useToast()
  const tokenAddress = getAddress(tokenData.TokenInfo.token.address)
  const { vaultAddress } = tokenData.TokenInfo
  const approveContract = useERC20(tokenAddress)
  const depositContract = useVault(vaultAddress)
  const { callWithGasPrice } = useCallWithGasPrice()
  const [isApproved, setIsApproved] = useState<boolean>(Number(allowance) > 0)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isApproving, setIsApproving] = useState<boolean>(false)

  const handleApprove = async () => {
    toastInfo(t('Approving...'), t('Please Wait!'))
    setIsApproving(true)
    try {
      const tx = await approveContract.approve(vaultAddress, ethers.constants.MaxUint256)
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Approved!'), t('Your request has been approved'))
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    } catch (error: any) {
      toastWarning(t('Error'), error.message)
    } finally {
      setIsApproving(false)
    }
  }

  const handleDeposit = async (convertedStakeAmount: BigNumber) => {
    const callOptions = {
      gasLimit: 380000,
    }
    const callOptionsBNB = {
      gasLimit: 380000,
      value: convertedStakeAmount.toString(),
    }
    setIsPending(true)
    try {
      toastInfo(t('Transaction Pending...'), t('Please Wait!'))
      const tx = await callWithGasPrice(
        depositContract,
        'deposit',
        [convertedStakeAmount.toString()],
        tokenName === 'BNB' ? callOptionsBNB : callOptions,
      )
      const receipt = await tx.wait()
      if (receipt.status) {
        toastSuccess(t('Successful!'), t('Your deposit was successfull'))
      }
    } catch (error) {
      toastError(t('Unsuccessful'), t('Something went wrong your deposit request. Please try again...'))
    } finally {
      setIsPending(false)
      setAmount(0)
    }
  }

  const handleConfirm = async () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(amount), 18)
    handleDeposit(convertedStakeAmount)
  }

  const assetsReceived = (Number(amount) / exchangeRate)?.toPrecision(3)

  return (
    <>
      <Flex justifyContent="space-between">
        <Text fontWeight="bold" color="#1A1D1F">{t('From')}</Text>
        <Text >{t('Balance')}: <span style={{ color: '#1a1d1f', fontWeight: 700 }}>{`${balance.toPrecision(4)} ${name}`}</span></Text>
      </Flex>
      <Section justifyContent="space-between">
        <Box>
          <Text
            style={{ backgroundColor: 'transparent', fontSize: '28px', fontWeight: 700, color: '#1a1d1f' }}
          >{amount}</Text>
        </Box>
        <Box>

          <MaxContainer>
            <Box>
              <button type="button" style={{ borderRadius: '8px', border: '1px solid #DDDFE0', background: 'transparent', cursor: 'pointer' }} onClick={setAmountToMax}>
                {t('MAX')}
              </button>
            </Box>
            <img src="/images/BNB.svg" style={{ marginLeft: '20px', marginRight: '15px' }} width='40px' alt="" />
            <Box>
              <Text style={{ color: '#1A1D1F', fontWeight: 700, }}>{name}</Text>
            </Box>
          </MaxContainer>
        </Box>
      </Section>
      <Flex flexDirection="column">
        <StyledArrowDown style={{ marginLeft: 'auto', marginRight: 'auto' }} />

        <Flex justifyContent="space-between">
          <Text fontWeight="bold" style={{ color: '#1A1D1F' }}>{t('Recieve (Estimated)')}</Text>
          <Text >{t('Balance')}: <span style={{ color: '#1a1d1f', fontWeight: 700 }}>{`${balance.toPrecision(4)} ${name}`}</span></Text>
        </Flex>
        <Section justifyContent="space-between">
          <Box>
            <Text
              style={{ backgroundColor: 'transparent', fontSize: '28px', fontWeight: 700, color: '#1a1d1f' }}
            >{assetsReceived !== 'NaN' ? assetsReceived : 0}</Text>
          </Box>
          <Box>

            <MaxContainer>

              <img src="/images/BNB.svg" style={{ marginLeft: '20px', marginRight: '15px' }} width='40px' alt="" />
              <Box>
                <Text style={{ color: '#1A1D1F', fontWeight: 700, }}>ib{name}</Text>
              </Box>
            </MaxContainer>
          </Box>
        </Section>
      </Flex>
      <ButtonGroup flexDirection="row" justifySelf="flex-end" justifyContent="space-evenly" mb="20px" mt="30px">
        <Flex style={{ alignItems: 'center', cursor: 'pointer' }}>
          <img src="/images/Cheveron.svg" alt="" />
          <Text style={{ height: '100%' }}>Back</Text>
        </Flex>
        {isApproved ? null : (
          <Button
            style={{ width: '160px' ,height:'57px'}}
            onClick={handleApprove}
            disabled={!account || isApproving}
            isLoading={isApproving}
            endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          >
            {isPending ? t('Approving') : t('Approve')}
          </Button>
        )}
        <Button
          style={{ width: '160px' ,height:'57px'}}
          onClick={handleApprove}
          disabled
          isLoading={isApproving}
          endIcon={isApproving ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Approving') : t('Transfer')}
        </Button>
        {/* <Button
          onClick={handleConfirm}
          disabled={
            !account ||
            !isApproved ||
            Number(amount) === 0 ||
            amount === undefined ||
            Number(balance) === 0 ||
            isPending
          }
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button> */}
      </ButtonGroup>
    </>
  )
}

export default Deposit
