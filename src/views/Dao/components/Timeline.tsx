import React from 'react'
import { Box, Flex, Text, useMatchBreakpoints } from '@huskifinance/huski-frontend-uikit'
import styled from 'styled-components'

// TIMELINE
const TimelineContainer = styled(Flex)`
  height: 360px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 120px;
    padding: 0 21px;
  }
  flex-direction: row-reverse;
  margin: 54px 0 105px;
  ${Text} {
    font-size: 14px;
    font-weight: 700;
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 18px;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    flex-direction: column;
    justify-content: center;
  }
`
const TimelineTrack = styled(Box)`
  background: white;
  position: relative;
  width: 4px;
  height: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
    height: 4px;
  }
`
const TimelineProgress = styled.div`
  background: #d953e9;
  height: 25%;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 25%;
    height: 100%;
  }
`
const TimelineStep = styled.div`
  height: 6px;
  width: 18px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 6px;
    height: 18px;
  }
  position: absolute;
  transform: translateY(-50%);
  background: white;
  border-radius: 6px;
  &:first-child {
    background: #d953e9;
    top: 0;
    ${({ theme }) => theme.mediaQueries.sm} {
      left: 0;
    }
  }
  &:nth-child(2) {
    background: #d953e9;
    top: 25%;
    ${({ theme }) => theme.mediaQueries.sm} {
      left: 25%;
    }
  }
  &:nth-child(3) {
    top: 75%;
    ${({ theme }) => theme.mediaQueries.sm} {
      left: 75%;
    }
  }
  &:nth-child(4) {
    top: 100%;
    ${({ theme }) => theme.mediaQueries.sm} {
      left: 100%;
    }
  }
`

export const Timeline = () => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <TimelineContainer>
      <Flex
        width="100%"
        position="relative"
        flexDirection={isMobile ? 'column' : 'row'}
        ml={isMobile ? '18px' : '0'}
        mb={isMobile ? '0' : '20px'}
      >
        <Text
          maxWidth="137px"
          maxHeight="fit-content"
          style={{
            color: 'white',
            transform: isMobile ? 'translate(0, -50%)' : null,
            position: 'absolute',
            left: '0',
            bottom: '0',
            top: isMobile ? '0' : null,
          }}
        >
          2021 Q4
          {isMobile ? <Text>Beta Test Huski Finance</Text> : null}
        </Text>
        <Text
          maxWidth="137px"
          maxHeight="fit-content"
          style={{
            color: 'white',
            transform: isMobile ? 'translate(0, -50%)' : 'translate(-50%)',
            position: 'absolute',
            left: isMobile ? '0' : '25%',
            bottom: '0',
            top: isMobile ? '25%' : null,
          }}
        >
          2022 Q1
          {isMobile ? <Text>DAO Launching Campaing</Text> : null}
        </Text>
        <Text
          maxWidth="137px"
          maxHeight="fit-content"
          style={{
            color: 'white',
            transform: isMobile ? 'translate(0, -50%)' : 'translate(-50%)',
            position: 'absolute',
            left: isMobile ? '0' : '75%',
            bottom: '0',
            top: isMobile ? '75%' : null,
          }}
        >
          2022 Q2
          {isMobile ? <Text>DAO Launch</Text> : null}
        </Text>
        <Text
          maxWidth="137px"
          maxHeight="fit-content"
          style={{
            color: 'white',
            transform: isMobile ? 'translate(0, 50%)' : null,
            position: 'absolute',
            right: isMobile ? null : '0',
            left: isMobile ? '0' : null,
            bottom: '0',
          }}
        >
          2022 Q3
          {isMobile ? <Text>Fair Launch Huski Finance</Text> : null}
        </Text>
      </Flex>
      <TimelineTrack>
        <TimelineStep />
        <TimelineStep />
        <TimelineStep />
        <TimelineStep />
        <TimelineProgress />
      </TimelineTrack>
      {isMobile ? null : (
        <Flex width="100%" position="relative" mt="17px">
          <Text
            maxWidth="137px"
            maxHeight="fit-content"
            style={{
              color: 'white',
              // transform: 'translate(-50%)',
              position: 'absolute',
              left: '0',
              top: '0',
            }}
          >
            Beta Test Huski Finance
          </Text>
          <Text
            maxWidth="137px"
            maxHeight="fit-content"
            style={{
              color: 'white',
              transform: 'translate(-50%)',
              position: 'absolute',
              left: '25%',
              top: '0',
            }}
          >
            DAO Launching Campaign
          </Text>
          <Text
            maxWidth="137px"
            maxHeight="fit-content"
            style={{
              color: 'white',
              transform: 'translate(-50%)',
              position: 'absolute',
              left: '75%',
              top: '0',
            }}
          >
            DAO Launch
          </Text>
          <Text
            maxWidth="137px"
            maxHeight="fit-content"
            textAlign="right"
            style={{
              color: 'white',
              // transform: 'translate(-50%)',
              position: 'absolute',
              right: '0',
              top: '0',
            }}
          >
            Fair Launch Huski Finance
          </Text>
        </Flex>
      )}
    </TimelineContainer>
  )
}
