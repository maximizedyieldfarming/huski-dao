import Page from 'components/Layout/Page'
import React, { useState } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useFarmsData } from 'state/levarage/hooks'
import styled from 'styled-components'
import Select from 'components/Select/Select'
import { Box, Button, Flex, Table, Text } from '@pancakeswap/uikit'
import husky2 from './assets/husky2.png'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'


const FakeTable = styled.div`
  background-color: #fff;
  border-radius: 1rem;
  flex: 1 auto;
`

const FakeTableRow = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  &:not(:last-child) {
    border-bottom: 1px solid #ccc;
  }
`
const FakeTableHeader = styled(FakeTableRow)`
  &:not(:last-child) {
    border-bottom: none;
  }
`

const TableWrapper = styled.div`
  background-color: #fff;
  margin-bottom: 2rem;
  border-radius: 20px;
  padding: 10px;
`

const SingleTableWrapper = styled(TableWrapper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1rem 2rem;
  > div:first-child {
    flex-basis: 20%;
  }
  > div:nth-child(2) {
    flex-grow: 1;
  }
`

const ActionCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const ImageContainer = styled.figure``

const StyledBox = styled(Box)`
  background-color: #fff;
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
  background-color: ${(props) => (props.isActive === 'true' ? '#9615E7' : '#fff')};
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
  background-color: #fff;
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
  const { data: farmData } = useFarms()

  const { farmsData } = useFarmsData()
  console.info('farmsData ---true',farmsData)
  const [isActivePos, setActive] = useState(true)

  const [firstToken, ...rest] = farmData

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

      <SingleTableWrapper>
        <FakeTable>
          <FakeTableHeader>
            <span>Position Value</span>
            <span>Debt Value</span>
            <span>Equity Value</span>
            <span>APY</span>
            <span>Debt Ratio</span>
            <span>Liquidation Ratio</span>
            <span>Risk Factor</span>
            <span>Action</span>
          </FakeTableHeader>
          <FakeTableRow>
            <span>{firstToken.lpSymbol}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <span>{}</span>
            <ActionCell>
              <ActionButton>Adjust Position</ActionButton>
              <ActionButton>Close Position</ActionButton>
            </ActionCell>
          </FakeTableRow>
        </FakeTable>
        <ImageContainer>
          <img src={husky2} alt="" />
        </ImageContainer>
      </SingleTableWrapper>

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

      <TableWrapper>
        <FakeTable>
          <FakeTableHeader>
            <span>Currency</span>
            <span>APR</span>
            <span>Total Supply</span>
            <span>Total Borrowed</span>
            <span>Utilization Rate</span>
            <span>Balance</span>
            <span>Action</span>
          </FakeTableHeader>
          {rest.map((token) => (
            <FakeTableRow key={token.pid}>
              <span>{token?.lpSymbol}</span>
              <span>{token?.pid}</span>
              <span>{token?.pid}</span>
              <span>{token?.pid}</span>
              <span>{token?.pid}</span>
              <span>{token?.pid}</span>
              <ActionCell>
                <ActionButton>Deposit</ActionButton>
                <ActionButton>Withdraw</ActionButton>
              </ActionCell>
            </FakeTableRow>
          ))}
        </FakeTable>
      </TableWrapper>
    </CustomPage>
  )
}

export default Levarage
