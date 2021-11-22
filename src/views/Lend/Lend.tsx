/* eslint-disable no-unused-expressions */
import React from 'react'
import { Text, Flex, Box, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useLendTotalSupply } from 'state/lend/hooks'
import { useLeverageFarms, usePollLeverageFarmsWithUserData } from 'state/leverage/hooks'
import { useTranslation } from 'contexts/Localization'
import LendTable from './components/LendTable/LendTable'
import headerBg from './BG.png'

const Section = styled(Flex)`
  background-color: 'transparent';
  font-family:inter;
  padding: 0.5rem;
  gap: 0.5rem;
  border-radius: ${({ theme }) => theme.radii.default};
  height:224px;
  .container {
    background-color: ${({ theme }) => theme.colors.background};
    padding: 1rem;
    border-radius: ${({ theme }) => theme.radii.small};
  }
  .block {
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
    border-radius: ${({ theme }) => theme.radii.small};
  }
`
const SBBox = styled(Box)`
  border-radius:15px!important;
  background-image: url(${headerBg});
  background-position: right;
  background-size: cover;
  background-repeat: no-repeat;
`

const Lend: React.FC = () => {
  const { t } = useTranslation()
  const lendTotalSupply = useLendTotalSupply()
  const { data: farmsData } = useLeverageFarms()
  const hash = {}
  const lendData = farmsData.reduce((cur, next) => {
    hash[next.TokenInfo.token.poolId] ? '' : (hash[next.TokenInfo.token.poolId] = true && cur.push(next))
    return cur
  }, [])

  console.log({ lendData })

  usePollLeverageFarmsWithUserData()

  const { isMobile, isTablet } = useMatchBreakpoints()
  const volume24 = undefined

  return (
    <Page>
      <Section>
        <SBBox className="block" style={{position:'relative',marginRight:'30px',display:'flex',alignItems:'center' }}>
          <h2 style={{color:'white',fontSize:'60px',marginLeft:'80px',fontWeight:800}}>Huski<br /> Finance</h2>
        </SBBox>
        <Flex className="container" style={{padding:'30px',flexDirection:'column',justifyContent:'space-evenly', background:'#D6C7F0',borderRadius:'15px',width:'20%',marginRight:'30px'}}>
          <img src="/images/8825.svg" width='70px' height='70px' alt="" />
          <Text color="textSubtle" style={{color:'#4B4B4B',marginTop:'30px'}}>{t(`Total Volume 24H:`)}</Text>
          {volume24 ? (
            <Text fontSize="30px" style={{color:'#4B4B4B'}}>
              {volume24}
            </Text>
          ) : (
            // <Skeleton width="180px" height="30px" />
            <Text fontSize="30px" style={{color:'#4B4B4B',fontWeight:1000}}>
              $123,123,126
            </Text>
          )}
          <Text fontSize="30px">{volume24}</Text>
        </Flex>
        <Flex className="container" style={{padding:'30px', flexDirection:'column',justifyContent:'space-evenly',background:'#E3F0F6',borderRadius:'15px',width:'20%'}}>
          <img src="/images/8826.svg" width='70px' height='70px' alt="" />
          <Text color="textSubtle" style={{color:'#4B4B4B',marginTop:'30px'}}>{t('Total Value Locked:')}</Text>
          {lendTotalSupply ? (
            <Text fontSize="30px" style={{color:'#4B4B4B',fontWeight:1000}}>{`$${lendTotalSupply}`}</Text>
          ) : (
            <Skeleton width="180px" height="30px" />
          )}
        </Flex>
      </Section>

      <LendTable lendData={lendData} />
    </Page>
  )
}

export default Lend
