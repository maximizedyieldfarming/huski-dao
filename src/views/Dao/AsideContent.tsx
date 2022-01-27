import React from 'react'
import { Box, Text } from '@huskifinance/huski-frontend-uikit'
import { Container } from './styles'

const AsideContent = () => {
  return (
    <>
      <Container>
        <Text>What is HUSKI DAO ?</Text>
        <Box>
          <Text className="title">Here are HUSKI DAO&apos;s missions</Text>
          <Text>
            open, free, and fair financial markets optimize earnings, lower risk, higher returns. governing the protocol
            with more fairness, transparency and democracy. expanding the boundary of the crypto funds.
          </Text>
        </Box>
        <Box>
          <Text className="title">Why be our co-branded partners</Text>
          <Text>
            Priority to list token pairs. Discount on the protocol to reduce fees. Priority to seek support for projects
            liquidity. Providing strategies to the protocol and making a profit.
          </Text>
        </Box>
        <Box width="100%" height="228px" background="#fff">
          img here
        </Box>
        <Box>
          <Text className="title">What are the funds for</Text>
          <Text>
            Community building, marketing, DAO operation, and DAO management, auditing, listing, protocol improvements.
          </Text>
        </Box>
        <Box>
          <Text className="title">What the protocol provides</Text>
          <Text>part of the collected fees as DAO operation cost. part of the tokens to incentive DAO members.</Text>
        </Box>
        <Box>
          <Text className="title">Here are what HUSKI DAO wants</Text>
          <Text>
            Funding partners. Web3 artists. Marketing partners. Developers both frontend and smart contract. Product
            thinkers. Community operators.
          </Text>
        </Box>
        <Box>
          <Text className="title">What we do</Text>
          <Text>
            Vote on core parameters. Vote to improve efficiencies. Vote to utilize new features. Vote to list pairs.
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default AsideContent
