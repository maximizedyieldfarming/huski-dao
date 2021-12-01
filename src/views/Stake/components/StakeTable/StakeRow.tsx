import React, { useState } from 'react'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import styled, { keyframes, css } from 'styled-components'
import { useMatchBreakpoints, Flex, Text, Box, ChevronDownIcon, ChevronUpIcon, Button } from 'husky-uikit1.0'
import { useHuskiPrice } from 'hooks/api'
import { useTranslation } from 'contexts/Localization'

import { BIG_ZERO, BIG_TEN } from 'utils/bigNumber'
import BigNumber from 'bignumber.js'
import { getStakeApy } from '../../helpers'
import AprCell from './Cells/AprCell'
import ActionCell from './Cells/ActionCell'
import TotalVolumeCell from './Cells/TotalVolumeCell'
import MyPosCell from './Cells/MyPosCell'
import NameCell from './Cells/NameCell'
import RewardsCell from './Cells/RewardsCell'
// import ClaimCell from './Cells/'
import StakedCell from './Cells/StakedCell'
import TotalValueCell from './Cells/TotalValueCell'

const expandAnimation = keyframes`
  from {
    max-height: 20px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 20px;
  }
`

const StyledActionPanel = styled(Flex)<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  .expandedArea {
    flex-direction: column;
    padding: 30px 20px;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
      align-items: center;
    }
    .titleContainer {
      flex: 1;
      padding-left: 12px;
      ${({ theme }) => theme.mediaQueries.sm} {
        padding-left: 32px;
      }
    }
  }
`
const StakeContainer = styled(Flex)`
  flex: 1 0 460px;
`

interface Props {
  disabled: boolean
}
const StyledButton = styled(Button)<Props>`
  background: ${({ disabled }) => (disabled ? '#FFFFFF' : '#7B3FE4')};
  border-radius: 10px;
  color: ${({ disabled }) => (!disabled ? 'white' : '#6F767E')};
  text-align: center;
  width: 140px;
  height: 48px;
  border: ${({ disabled }) => (disabled ? '1px solid #EFEFEF' : 'none')};
`

const MaxContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 6px;
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
const StyledRow = styled.div<{ huski?: boolean; expanded?: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border-left: ${({ theme, huski }) => (huski ? `2px solid  ${theme.colors.secondary}` : 'unset')};
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  > ${Flex}:first-child {
    flex-direction: column;
    ${({ theme }) => theme.mediaQueries.lg} {
      flex-direction: row;
    }
  }
  > ${Flex}:first-child {
    border-bottom: 2px solid ${({ theme, expanded }) => (expanded ? theme.colors.disabled : 'transparent')};
  }
`

const StakeRow = ({ tokenData }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isTablet, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)
  const huskyPrice = useHuskiPrice()
  console.log({ huskyPrice })
  const { t } = useTranslation()
  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const { totalToken } = tokenData
  const { stakedBalance } = tokenData.userData
  const userTokenBalanceCalc = (userBalance) => new BigNumber(userBalance).dividedBy(BIG_TEN.pow(18))

  const userStakedBalance = userTokenBalanceCalc(stakedBalance).toNumber()

  return (
    <StyledRow role="row" huski={tokenData?.symbol.toLowerCase() === 'shuski'} expanded= {expanded}>
      <Flex onClick={toggleExpanded} mr='20px' ml='20px'>
        <NameCell token={tokenData} />
        <AprCell getApyData={getStakeApy(tokenData, huskyPrice)} />
        {/* ================================fake data================================== */}
        <MyPosCell supply={9345345} />
        {/* ================================fake data================================== */}
        <TotalVolumeCell supply={parseInt(totalToken)} />
        <TotalValueCell supply={parseInt(totalToken)} />
        {/* <ActionCell token={tokenData} /> */}
        {shouldRenderActionPanel ? <ChevronUpIcon mr="10px" /> : <ChevronDownIcon mr="10px" />}
      </Flex>
      <StyledActionPanel flexDirection="column" expanded={expanded} >
        {/* {shouldRenderActionPanel ? (
          <>
            <ChevronUpIcon mx="auto" />
            <Flex className="expandedArea">
              <Box className="titleContainer">
                <Text>{t('My Positions')}</Text>
              </Box>
              <StakedCell staked={userStakedBalance.toPrecision(4)} name={tokenData?.symbol} />
              <RewardsCell token={tokenData} />
              <ClaimCell token={tokenData} />
            </Flex>
          </>
        ) : (
          <ChevronDownIcon mx="auto" />
        )} */}
        {shouldRenderActionPanel ? (
          <>
            <Flex className="expandedArea" >
              <StakeContainer flexDirection='column'>
                <Flex alignItems='center' justifyContent='space-between'>
                  <Text color="text" fontSize="14px" fontWeight='700'>{t('I Want to stake')}</Text>
                  <Text color="textSubtle" fontSize='12px'>balance:<span style={{ color: '#1A1D1F', fontSize: '12px', fontWeight: 700 }}>200.908897 iBNB</span></Text>
                </Flex>
                <MaxContainer>
                  <Text
                    color="textFarm" fontSize='28px' fontWeight='700'
                  >1.55</Text>
                  <Flex alignItems='center'>
                    <Box >
                      <button type="button" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #DDDFE0', background: '#FFFFFF', cursor: 'pointer' }} >
                        {t('MAX')}
                      </button>
                    </Box>
                    <StyledButton
                    >
                      {t('Stake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer flexDirection='column' mr='60px' ml='30px'>
                <Flex alignItems='center' justifyContent='space-between'>
                  <Text color="text" fontSize="14px" fontWeight='700'>{t('I Want to Unstake')}</Text>
                  <Text color="textSubtle" fontSize='12px'>balance:<span style={{ color: '#1A1D1F', fontSize: '12px', fontWeight: 700 }}>200.908897 iBNB</span></Text>
                </Flex>
                <MaxContainer>
                  <Text
                    color="textFarm" fontSize='28px' fontWeight='700'
                  >1.55</Text>
                  <Flex alignItems='center'>
                    <Box >
                      <button type="button" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #DDDFE0', background: '#FFFFFF', cursor: 'pointer' }} >
                        {t('MAX')}
                      </button>
                    </Box>
                    <StyledButton
                    >
                      {t('Stake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
              <StakeContainer flexDirection='column' pl='60px' style={{ borderLeft: '2px solid #EFEFEF' }}>
                <Flex alignItems='center' justifyContent='space-between'>
                  <Text color="text" fontSize="14px" fontWeight='700'>{t('HUSKI Rewards')}</Text>

                </Flex>
                <MaxContainer>
                  <Text
                    color="textFarm" fontSize='28px' fontWeight='700'
                  >1.55</Text>
                  <Flex alignItems='center'>
                    <Box >
                      <button type="button" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #DDDFE0', background: '#FFFFFF', cursor: 'pointer' }} >
                        {t('MAX')}
                      </button>
                    </Box>
                    <StyledButton
                    >
                      {t('Stake')}
                    </StyledButton>
                  </Flex>
                </MaxContainer>
              </StakeContainer>
            </Flex>
          </>
        ) : (
          <div />
        )}
      </StyledActionPanel>
    </StyledRow>
  )
}

export default StakeRow
