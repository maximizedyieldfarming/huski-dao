import { Box, Button, Flex, Link, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import React from 'react'
import styled from 'styled-components'

const WarriorCard = styled(Box)`
  background: linear-gradient(125deg, #3ed3dd 0%, #1cc3ce 100%);
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  width: 594px;
  height: 330px;
  color: #fff;
  padding: 1rem;
  margin-right: 1rem;
`

const StatsCard = styled(Box)`
  background: #fff;
  display: flex;
  padding: 1rem;
  div {
    color: #9615e7;
  }
  > div {
    flex: 1;
    padding: 0 1rem;
    &:first-child {
      border-right: 1px solid #9615E780; 
      flex-flow: row wrap;
      justify-content: space-between;
      > div:nth-last-child(-n + 2) {
        align-self: flex-end;
      }
    }
    &:last-child{
      flex-flow: row wrap;
      justify-content: space-between;
      > div:nth-child(2) {
       align-self: flex-end;
       order: 3;
     }
     >div:last-child {
       align-self: center;
     } 
    }
    }
  }
`

const ClaimButton = styled(Button)`
  padding: 0.75rem 2rem;
  font-size: 14px;
  font-weight: 400;
  height: auto;
  box-shadow: none;
`

const StyledLink = styled(Link)`
  background-color: #f7931a;
  padding: 1rem;
  border-radius: 10px 4px 4px 10px;
  margin-right: -1.2rem;
`

const WarriorID: React.FC = () => {
  return (
    <Page>
      <Flex justifyContent="space-between">
        <WarriorCard>
          <Flex justifyContent="space-between" height="100%">
            <Flex flexDirection="column" justifyContent="space-around">
              <Box>
                <Text color="#fff" fontSize="18px">
                  Huski:
                </Text>
                <Text color="#fff" fontSize="48px">
                  0.00
                </Text>
              </Box>
              <Box>
                <Text color="#fff" fontSize="18px">
                  Medals:
                </Text>
                <Text color="#fff" fontSize="48px">
                  0.00
                </Text>
              </Box>
            </Flex>

            <Flex flexDirection="column" justifyContent="space-around">
              <Text color="#fff" fontSize="24px">
                Rank 5
              </Text>
              <StyledLink href="#" color="#fff" style={{ alignSelf: 'flex-end' }}>
                View Details
              </StyledLink>
            </Flex>
          </Flex>
        </WarriorCard>
        <StatsCard>
          <Flex>
            <Box>
              <Text>Total Rewards</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
            <Box>
              <Text>Medals Collected</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
            <Box>
              <Text>Medal Rewards</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
            <Box>
              <Text>Friends Invited</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
          </Flex>
          <Flex>
            <Box>
              <Text>BUSD Rewards</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
            <Box>
              <Text>BNB Rewards</Text>
              <Text fontSize="36px">0.00</Text>
            </Box>
            <Box>
              <ClaimButton>Claim</ClaimButton>
            </Box>
          </Flex>
        </StatsCard>
      </Flex>
    </Page>
  )
}

export default WarriorID
