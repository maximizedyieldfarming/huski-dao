import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useLevarageFarms, usePollFarmsWithUserData } from 'state/levarage/hooks'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import { Box, Button, Flex, Table, Text } from '@pancakeswap/uikit'
import husky2 from './assets/husky2@1x.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'
import LevarageTable from './components/LevarageTable/LevarageTable'
import TopTable from './components/TopTable/TopTable'

const TableWrapper = styled.div`
  background-color: ${({ theme }) => theme.card.background};
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  > div:first-child {
    flex-grow: 1;
  }
  > figure {
    display: none;
    ${({ theme }) => theme.mediaQueries.xxl} {
      display: block;
    }
  }
`
const ImageContainer = styled.figure``

const StyledBox = styled(Box)`
  color: #9615e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 10px;
  gap: 1rem;
  span:last-child {
    font-size: 2rem;
  }
`

const Title = styled.div`
  color: #9615e7;
  font-size: 36px;
`

const ActionButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`
const PositionsButton = styled(ActionButton)`
  background-color: ${(props) => (props.isActive === 'true' ? '#9615E7' : ({ theme }) => theme.card.background)};
  border: 1px solid #9615e7;
  color: ${(props) => (props.isActive === 'true' ? '#fff' : '#9615E7')};
  font-size: 20px;
  font-weight: bold;
  border-radius: 21px;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`

const StyledFlex = styled(Flex)`
  flex-direction: row;
  position: relative;
  background-color: ${({ theme }) => theme.card.background};
  padding: 5px 2rem;
`

const CustomPage = styled(Page)`
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  margin-right: 5%;
  max-width: none;
`

const Levarage: React.FC = () => {
  // const { data: farmsData } = useFarms()
  // console.info('useFarms', useFarms())

  const { data: farmsData } = useLevarageFarms()
  console.info('useLevarageFarms：', useLevarageFarms())
  // console.table(farmsData)
  const [isActivePos, setActive] = useState(true)

  // const [firstToken, ...rest] = farmData

  return (
    <CustomPage>
      <Flex justifyContent="space-between">
        <Flex alignSelf="flex-end" style={{ gap: '1rem' }}>
          <PositionsButton isActive={isActivePos ? 'true' : 'false'} onClick={() => setActive(true)}>
            Active Positions
          </PositionsButton>
          <PositionsButton isActive={isActivePos ? 'false' : 'true'} onClick={() => setActive(false)}>
            Liquidated Positions
          </PositionsButton>
        </Flex>
        <Flex justifyContent="space-between" marginBottom="1rem" alignSelf="flex-end">
          <StyledFlex flexDirection="row" borderRadius="20px">
            <ImageContainer style={{ position: 'absolute', left: '-35px' }}>
              <img src={bone2} alt="" />
            </ImageContainer>
            <StyledBox>
              <span>Husky Token Rewards</span>
              <Flex alignItems="center" style={{ gap: '10px' }}>
                <Text color="#9615E7" fontSize="30px">
                  169.73
                </Text>
                <ActionButton>Claim</ActionButton>
              </Flex>
            </StyledBox>
            <ImageContainer style={{ position: 'absolute', right: '-35px' }}>
              <img src={bone1} alt="" />
            </ImageContainer>
          </StyledFlex>
        </Flex>
      </Flex>

      <TableWrapper>
        <TopTable data={farmsData} isActivePos={isActivePos} />
        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </TableWrapper>

      <Flex alignSelf="flex-end">
        <Select
          options={[
            {
              label: 'Anual Income',
              value: 'anual_income',
            },
            {
              label: 'APR',
              value: 'apr',
            },
            {
              label: 'Multiplier',
              value: 'multiplier',
            },
            {
              label: 'Earned',
              value: 'earned',
            },
            {
              label: 'Liquidity',
              value: 'liquidity',
            },
          ]}
        />
      </Flex>
      <LevarageTable levarageData={farmsData} />
    </CustomPage>
  )
}

export default Levarage
