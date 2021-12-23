import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Box, Button, Flex, Input, Text, AutoRenewIcon, useMatchBreakpoints } from 'husky-uikit1.0'
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


interface LocationParams {
  data?: any
}

const StyledPage = styled(Page)`
  align-items: center;
  justify-content: start;
  gap: 20px;
`

const ButtonGroup = styled(Flex)`
  gap: 10px;
  align-items:center;
`
const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 12px;
  max-width: 510px;
  max-height: 528px;
  padding: 1rem;
  > * {
    margin: 1rem 0;
  }
  &.locked {
    padding-top:30px;
    padding-bottom:30px;
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
const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.colors.background};
  
  border-radius: ${({ theme }) => theme.radii.small};
  justify-content: space-between;
  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight:600;
    font-size:12px;
  }
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
      <img src="/images/HuskiPaw.png" alt="" />
      <Text fontSize="25px" mb='20px' bold>{`${t('Lock')} HUSKI UP`}</Text>
      <Container>
        <Section className="gray" mt="1rem">
          <Flex justifyContent='space-between' flex='1'>
            <Text fontSize='14px' color="text" fontWeight="700">{t('Amount')}</Text>
            <Text fontSize="12px" color="textSubtle" >
              {t('Balance')}: <span>200.90 HUSKI</span>
            </Text>
          </Flex>

        </Section>
        <Section justifyContent="space-between" pt='30px' pb='30px'>
          <Box ml='10px'>
            <Text
              style={{ backgroundColor: 'transparent', fontSize: '28px', fontWeight: 700, }} color="textFarm"
            >{amount}</Text>
          </Box>
          <Box>

            <MaxContainer>
              <Box>
                <button type="button" style={{ width: '48px', height: '34px', borderRadius: '8px', border: '1px solid #DDDFE0', background: 'transparent', cursor: 'pointer' }} onClick={setAmountToMax}>
                  <Text>{t('MAX')}</Text>
                </button>
              </Box>
              <img src="/images/lock/sHuski.png" style={{ marginLeft: '20px', marginRight: '15px' }} width='40px' alt="" />
              <Box>
                <Text color="textFarm" style={{ fontWeight: 700, }}>{name}</Text>
              </Box>
            </MaxContainer>
          </Box>
        </Section>
        {/* <Box>
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
        </Box> */}
        <Flex justifyContent="space-around" flexWrap='wrap'>
          <Text color='textFarm' fontWeight='700'>Lock HUSKI for</Text>
          <Text style={{ textDecoration: 'underline' }} color='#7B3FE4' bold>&nbsp;3 weeks + 3 Days & </Text>
          <Text style={{ textDecoration: 'underline' }} color='#7B3FE4' bold>&nbsp;Auto-Relock Monthly</Text>
        </Flex>
        <Flex justifyContent="space-between" >
          <Text color="textFarm" mt='10px'>{t('APY')}</Text>
          <Text fontWeight='700'>{apy}%</Text>
        </Flex>
        <Flex justifyContent="space-between" >
          <Text color="textFarm" mt='10px'>{t('Unlock Date Monthly')}</Text>
          <Text fontWeight='700'>14th Oct</Text>
        </Flex>
        {/* <Button
          disabled={Number(amount) === 0 || amount === undefined || Number(balance) === 0 || isPending}
          isLoading={isPending}
          endIcon={isPending ? <AutoRenewIcon spin color="backgroundAlt" /> : null}
          width="100%"
        >
          {isPending ? t('Confirming') : t('Confirm')}
        </Button> */}
        <ButtonGroup flexWrap='wrap' flexDirection="row" justifySelf="space-between" justifyContent="space-evenly" mb="20px" mt="30px!important">
          <Flex flex='0.8' style={{ alignItems: 'center', cursor: 'pointer' }} mb='10px'>
            <img src="/images/Cheveron.svg" alt="" />
            <Text color="textSubtle" fontWeight="bold" fontSize="16px" style={{ height: '100%' }}>Back</Text>
          </Flex>
          <Flex>
            <Button
              style={{ width: '150px', height: '50px', borderRadius: '16px', marginRight: '10px' }}
            >
              Confirm
            </Button>
            <Button
              style={{ color: '#6F767E', backgroundColor: '#F4F4F4', width: '150px', height: '50px', borderRadius: '16px' }} disabled
            >
              Lock
            </Button>
          </Flex>
        </ButtonGroup>
      </Container>
      <Container className="locked">
        <Text color="text" fontWeight='700' mr="2rem">
          {t('Staked')}
        </Text>
        <Flex>
          <img src="/images/lock/sHuski.png" style={{ marginLeft: '20px', marginRight: '15px' }} width='24px' alt="" />
          <Text color="text" fontWeight='700'>56.324 sHUSKI</Text>
        </Flex>
      </Container>
    </StyledPage>
  )
}

export default LockAction
