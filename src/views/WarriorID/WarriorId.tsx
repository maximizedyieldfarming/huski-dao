import { Box, Button, Flex, Image, Link, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import React from 'react'
import styled from 'styled-components'
import warrior from './assets/warrior@1x.png'
import frndsInvIcon from './assets/friendsInvited@1x.png'
import medalCollIcon from './assets/medalCollected@1x.png'
import medalRwdsIcon from './assets/medalRewards.png'
import totalRwdsIcon from './assets/totalRewards.png'
import containingIcon from './assets/containing@1x.png'
import WarriorTable from './components/WarriorTable/WarriorTable'
import bone1 from './assets/bone1-1x.png'
import bone2 from './assets/bone2-1x.png'

const WarriorCard = styled(Box)`
  flex: 1;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem;
  margin-right: 1rem;
  div {
    color: #9615e7;
  }

  > ${Flex} {
    padding: 1rem;
    flex-direction: column;
    justify-content: space-between;
    &:first-child {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(${bone2});
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto;
        opacity: 0.25;
      }
    }
    &:last-child {
      background: linear-gradient(125deg, #3ed3dd 0%, #1cc3ce 100%);
      border-radius: 20px;
      padding: 10px;
      position: relative;
    }
  }
`

const StatsCard = styled(Box)`
  flex: 1.5;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  background: #fff;
  display: flex;
  padding: 1rem;
  div {
    color: #9615e7;
  }
  > ${Flex} {
    flex: 1;
    padding: 1rem;
    &:first-child {
      flex-flow: row wrap;
      justify-content: space-between;
      align-content: space-between;
      position: relative;
      ${Text}{
      text-align:center;
      }
      &::before {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(${bone2});
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto;
        opacity: 0.25;
      }
    }
    &:last-child{
      background: #EDF8FD;
      border-radius: 20px;
      flex-flow: row wrap;
      justify-content: space-between;
      position: relative;
      >${Flex}{
        flex-direction: column;
        justify-content: space-between;
        &:last-child {
          align-items: center;
          justify-content: center;
        }
      }
      &::before {
        content: '';
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        background-image: url(${bone1});
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto;
        opacity: 0.25;
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
  padding: 7px;
  border-radius: 17px 6px 6px 17px;
  position: absolute;
  right: -20px;
  bottom: 0;
`
// MOCK DATA
const rewardsData = [
  {
    tier: 'tier 1',
    total: '100',
    available: '20',
    totalRewardsDistributed: '100US + 100BNB',
    rewardsPerWarrior: '1BUSD + 1BNB',
  },
  {
    tier: 'tier 2',
    total: '100',
    available: '20',
    totalRewardsDistributed: '100US + 100BNB',
    rewardsPerWarrior: '1BUSD + 1BNB',
  },
  {
    tier: 'tier 3',
    total: '100',
    available: '20',
    totalRewardsDistributed: '100US + 100BNB',
    rewardsPerWarrior: '1BUSD + 1BNB',
  },
  {
    tier: 'tier 4',
    total: '100',
    available: '20',
    totalRewardsDistributed: '100US + 100BNB',
    rewardsPerWarrior: '1BUSD + 1BNB',
  },
  {
    tier: 'tier 5',
    total: '100',
    available: '20',
    totalRewardsDistributed: '100US + 100BNB',
    rewardsPerWarrior: '1BUSD + 1BNB',
  },
]

const WarriorID: React.FC = () => {
  return (
    <Page>
      <Flex justifyContent="space-between" marginBottom="2%">
        <WarriorCard>
          <Flex>
            <Box>
              <Text fontSize="18px">Containing:</Text>
              <Text fontSize="36px">
                <img src={containingIcon} alt="" /> 0.00
              </Text>
            </Box>
            <Box>
              <Text fontSize="18px">Medals:</Text>
              <Text fontSize="36px">
                <img src={medalRwdsIcon} alt="" /> 0.00
              </Text>
            </Box>
          </Flex>

          <Flex flexDirection="column">
            <Text as="span" color="#fff" fontSize="18px" fontWeight="bold" textAlign="center">
              Tier 5
            </Text>
            <figure>
              <img src={warrior} alt="" width="226" height="263" />
            </figure>
            <StyledLink href="#" color="#fff" style={{ alignSelf: 'flex-end' }}>
              View Details
            </StyledLink>
          </Flex>
        </WarriorCard>

        <StatsCard>
          <Flex>
            <Box>
              <Text>Total Rewards</Text>
              <Text fontSize="36px">
                {' '}
                <img src={totalRwdsIcon} alt="" /> 0.00
              </Text>
            </Box>
            <Box>
              <Text>Medals Collected</Text>
              <Text fontSize="36px">
                <img src={medalCollIcon} alt="" /> 0.00
              </Text>
            </Box>
            <Box>
              <Text>Medal Rewards</Text>
              <Text fontSize="36px">
                <img src={medalRwdsIcon} alt="" /> 0.00
              </Text>
            </Box>
            <Box>
              <Text>Friends Invited</Text>
              <Text fontSize="36px">
                <img src={frndsInvIcon} alt="" /> 0.00
              </Text>
            </Box>
          </Flex>

          <Flex>
            <Flex>
              <Box>
                <Text>BUSD Rewards</Text>
                <Text fontSize="36px">0.00</Text>
              </Box>
              <Box>
                <Text>BNB Rewards</Text>
                <Text fontSize="36px">0.00</Text>
              </Box>
            </Flex>
            <Flex>
              <Box>
                <ClaimButton>Claim</ClaimButton>
              </Box>
            </Flex>
          </Flex>
        </StatsCard>
      </Flex>

      <WarriorTable rewardsData={rewardsData} />
    </Page>
  )
}

export default WarriorID
