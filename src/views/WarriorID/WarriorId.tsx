import { Box, Flex, Link, Text } from '@pancakeswap/uikit'
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
`

const StatsCard = styled(Box)`
  background: #fff;
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
            <Flex flexDirection="column">
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

            <Flex flexDirection="column">
              <Text color="#fff" fontSize="24px">
                Rank 5
              </Text>
              <StyledLink href="#" color="#fff" style={{ alignSelf: 'flex-end' }}>
                View Details
              </StyledLink>
            </Flex>
          </Flex>
        </WarriorCard>
        <StatsCard>a</StatsCard>
      </Flex>
    </Page>
  )
}

export default WarriorID
