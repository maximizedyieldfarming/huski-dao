import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Button, Flex, Input, Text, AutoRenewIcon } from '@pancakeswap/uikit'
import NumberInput from 'components/NumberInput'
import Page from 'components/Layout/Page'
import useTokenBalance from 'hooks/useTokenBalance'
import { getAddress } from 'utils/addressHelpers'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { useMatchBreakpoints } from 'husky-uikit'

interface LocationParams {
  data?: any
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: center;
  gap: 2rem;
`
const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  width: 510px;
  max-height: 528px;
  padding: 1rem;
  > * {
    margin: 1rem 0;
  }
  &.locked {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    > * {
      margin: unset;
    }
  }
`

const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.small};
  justify-content: space-between;
  &.gray {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const LockAction = () => {
  const { t } = useTranslation()
  const {
    state: { data: lockData },
  } = useLocation<LocationParams>()

  const { name } = lockData

  const [isPending, setIsPending] = useState(false)
  const balance = 0

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

  const date = new Date()
  const dd = date.getDate()
  const mm = date.getMonth()
  const yyyy = date.getFullYear()
  const currentDate = `${mm}/${dd}/${yyyy}`
  const inOneMonth = new Date(date.setMonth(date.getMonth() + 1))
  const inThreeMonths = new Date(date.setMonth(date.getMonth() + 3))
  const inSixMonths = new Date(date.setMonth(date.getMonth() + 6))
  const inOneYear = new Date(date.setFullYear(date.getFullYear() + 1))
  const [displayDate, setDisplayDate] = useState(currentDate)

  const { isMobile } = useMatchBreakpoints()

  const apy = 0
  const receiveAmount = 0
  const locked = 0

  return (
    <StyledPage>
      <Text fontSize="3" bold>{`${t('Lock')} ${name}`}</Text>
      <Container>
        <Section className="gray" mt="1rem">
          <Box>
            <Text color="textSubtle">{t('Amount')}</Text>
            <NumberInput placeholder="0.00" onChange={handleAmountChange} step="0.01" value={amount} />
          </Box>
          <Box>
            <Text color="textSubtle" fontWeight="bold">
              {t('Balance')}: {balance} {name}
            </Text>
            <Button variant="tertiary" scale="xs" onClick={setAmountToMax}>
              {t('MAX')}
            </Button>
          </Box>
        </Section>
        <Box>
          <Text color="textSubtle">{t('Unlock Date')}</Text>
          <Section className="gray">
            <Text>{displayDate}</Text>
          </Section>
          <Flex justifyContent="space-around" mt="0.5rem">
            <Button variant="secondary" scale="sm">
              {t('1 month')}
            </Button>
            <Button variant="secondary" scale="sm">
              {t('3 months')}
            </Button>
            <Button variant="secondary" scale="sm">
              {t('6 months')}
            </Button>
            <Button variant="secondary" scale="sm">
              {t('1 year')}
            </Button>
          </Flex>
        </Box>
        <Flex justifyContent="space-between" padding="0 2rem">
          <Text color="textSubtle">{t('APY')}</Text>
          <Text>{apy}%</Text>
        </Flex>
        <Flex justifyContent="space-between" padding="0 2rem">
          <Text color="textSubtle">{t(`You'll receive`)}</Text>
          <Text>{receiveAmount} sHUSKI</Text>
        </Flex>
        <Button
          disabled={Number(amount) === 0 || amount === undefined || Number(balance) === 0 || isPending}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          width="100%"
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button>
      </Container>
      <Container className="locked">
        <Text color="textSubtle" mr="2rem">
          {t('Locked')}
        </Text>
        <Text color="textSubtle">{locked}</Text>
      </Container>
    </StyledPage>
  )
}

export default LockAction
