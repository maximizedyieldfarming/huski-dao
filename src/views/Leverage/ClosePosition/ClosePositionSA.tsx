import React, { useState } from 'react'
import { useLocation } from 'react-router'
import { Box, Flex, Text, useTooltip, InfoIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { ArrowDownIcon } from 'assets'

interface LocationParams {
  data: any
}

const Bubble = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.default};
  gap: 10px;
`

const Container = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  box-shadow: 0px 0px 10px 0px rgba(191, 190, 190, 0.29);
  border-radius: 20px;
  width: 510px;
  max-height: 528px;
  padding: 1rem;
  > * {
    margin: 1rem 0;
  }
`
const Section = styled(Flex)`
  background-color: ${({ theme }) => theme.card.background};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radii.small};
  justify-content: space-between;
  &.gray {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const ClosePositionSA = () => {
  const { t } = useTranslation()
 const {
    state: { data },
  } = useLocation<LocationParams>()
  const positionValue = null
  const poolName = null
  const positionId = null

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>{t('text')}</Text>
    </>,
    { placement: 'right' },
  )

  return (
    <Page>
      <Text fontSize="36px" textTransform="capitalize" mx="auto">
        {t('Close Position')}
      </Text>
      <Box mx="auto">
        <Flex alignItems="center" justifyContent="flex-end">
          <Bubble alignSelf="flex-end" alignItems="center">
            <Text>{poolName}</Text>
            <Text>#{positionId}</Text>
            <Flex alignItems="center">
              <Box width={40} height={40}>
                {/*   <TokenPairImage
                primaryToken={quoteTokenValue}
                secondaryToken={tokenValue}
                width={40}
                height={40}
                variant="inverted"
              /> */}
              </Box>
              {/*  <Text style={{ whiteSpace: 'nowrap' }} ml="5px">
              {lpSymbolName.replace(' PancakeswapWorker', '')}
            </Text> */}
            </Flex>
          </Bubble>
        </Flex>
        <Container mt="2rem">
          <Section className="gray" mt="1rem">
            <Text>{t('Position Value')}</Text>
          </Section>
          <Flex flexDirection="column" alignItems="center">
            <ArrowDownIcon mx="auto" />
            <Flex alignItems="center">
              <Text mx="auto">{t('Assets Received')}</Text>
              {tooltipVisible && tooltip}
              <span ref={targetRef}>
                <InfoIcon ml="5px" />
              </span>
            </Flex>
          </Flex>
          <Section className="gray" mt="1rem">
            <Text textAlign="center">{t('Assets Received')}</Text>
          </Section>
        </Container>
      </Box>
    </Page>
  )
}

export default ClosePositionSA
