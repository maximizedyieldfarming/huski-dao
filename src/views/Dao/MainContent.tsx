import React from 'react'
import styled from 'styled-components'
import { Box, Text, Flex } from '@huskifinance/huski-frontend-uikit'
import { Container } from './styles'
import { HuskiDao } from './assets'

const MainContent = () => {
  return (
    <>
      <Container>
        <HuskiDao />
        <Text>Main</Text>
      </Container>
      <Container>
        <Text>Main</Text>
      </Container>
      <Container>
        <Text>Main</Text>
      </Container>
    </>
  )
}

export default MainContent
