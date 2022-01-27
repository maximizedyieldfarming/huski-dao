import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import useTheme from 'hooks/useTheme'
import { Text, Flex, Box, Button, Grid, Heading, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Page from 'components/Layout/Page'
// import CurrencyInputHeader from 'components/CurrencyInputHeader'
import { AppBody } from 'components/App'

import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

const Section = styled(Flex)`
  background-color: 'transparent';
  font-family: inter;
  flex-direction: column;
  overflow: auto;
  ::-webkit-scrollbar {
    height: 8px;
  }
  > div:not(:last-child) {
    margin-bottom: 1rem;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    height: 135px;
    flex-direction: row;
    justify-content: space-between;
    > div:not(:last-child) {
      margin-right: 1rem;
      margin-bottom: 0;
    }
  }
`
const SBBox = styled(Box)`
  > h2 {
    font-family: 'BalooBhaijaan';
  }
  align-items: center;
  display: flex;
  border-radius: 15px !important;
  backdrop-filter: blur(200px);
  min-width: 520px;
  @media screen and (max-width: 1480px) {
    padding: 30px 0px;
  }
  @media screen and (max-width: 600px) {
    min-width: unset;
    > h2 {
      margin-left: 20px !important;
      font-size: 35px !important;
    }
  }
`

const Dao: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const { isMobile, isTablet } = useMatchBreakpoints()
  const isSmallScreen = isMobile || isTablet

  return (
    <>
      <Page>
        <Flex>
          <Text>how to xxx</Text>
          <Button >
            Launch App
          </Button>
          <Button >
            Launch App
          </Button>
        </Flex>
        <Section>
          <SBBox
            className="block"
            style={{
              position: 'relative',
              display: 'flex',
              background: 'red',
              alignItems: 'center',
              flex: isSmallScreen ? '1' : '5',
            }}
          >
            Huski Finance
          </SBBox>
          <SBBox
            className="block"
            style={{
              position: 'relative',
              display: 'flex',
              background: 'red',
              alignItems: 'center',
              flex: isSmallScreen ? '1' : '5',
            }}
          >
            Huski Finance
          </SBBox>

        </Section>
        <Section>
          <Button >
            Launch App
          </Button>
          <br />
          <Button >
            Launch App
          </Button>
        </Section>



        <Flex width="100%" justifyContent="center" position="relative">
          <Flex flexDirection="column">
            <StyledSwapContainer $isChartExpanded={isChartExpanded}>
              <StyledInputCurrencyWrapper mt={isChartExpanded ? '24px' : '0'}>

                <AppBody>
                  <Flex flexDirection="column" alignItems="center">
                    <Heading as="h2" mb="8px">
                      aaaaa
                    </Heading>
                    <Flex alignItems="center">
                      <Text color="textSubtle" fontSize="14px">
                        sssss
                      </Text>
                    </Flex>
                  </Flex>

                </AppBody>
              </StyledInputCurrencyWrapper>
            </StyledSwapContainer>
          </Flex>
        </Flex>
      </Page>

    </>
  )
}

export default Dao
