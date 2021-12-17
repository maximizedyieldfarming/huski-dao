import React from 'react'
import styled from 'styled-components'
import { DogRunning } from 'components/DogLoader'
import Page from '../Layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <DogRunning />
    </Wrapper>
  )
}

export default PageLoader
