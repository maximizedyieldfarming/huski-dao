import React, { ComponentProps, ElementType, ReactElement } from 'react'
import {
  Box,
  Flex,
  Button,
  ButtonMenu as UikitButtonMenu,
  ButtonMenuItemProps,
  BaseButtonProps,
  Text,
} from '@huskifinance/huski-frontend-uikit'
import styled, { css } from 'styled-components'

export const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
`
export const Body = styled(Flex)`
  width: 100%;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
  }
  > * {
    flex: 1 0 50%;
  }
`
export const Main = styled(Box)`
  height: 100%;
`
export const Aside = styled(Box)`
  height: 100%;
`
export const Container = styled(Flex)`
  background: linear-gradient(167.86deg, #1d1723 4.99%, #1d1727 92.76%);
  border: 2px solid #282627;
  border-radius: 15px;
  width: 100%;
  max-width: 513px;
  flex-direction: column;
  align-items: center;
`
export const Footer = styled(Box)``

/* const gradientBorder = css`
  display: flex;
  align-items: center;
  width: 90%;
  margin: auto;
  max-width: 22em;

  position: relative;
  padding: 1rem;
  box-sizing: border-box;

  background-clip: padding-box;
  border: 2px solid transparent; 

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -2px;
    border-radius: inherit;
    background: linear-gradient(to right, red, orange);
  }
` */

export const StyledButton = styled(Button)<{ filled?: boolean }>`
  background: ${({ filled }) => (filled ? 'linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)' : '#16131e')};
  border: ${({ filled }) => (filled ? 'none' : '1px solid white')};
  border-radius: 14px;
  color: #fff;
  font-weight: 700;
  box-shadow: none;
`
export const InputContainer = styled(Flex)`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 0 10px;
  align-items: center;
  > input {
    background: none;
    border-radius: 0;
    border: none;
  }
`
export const Banner = styled(Flex)`
  align-items: center;
  background: #261f30;
  border-radius: 8px;
  width: fit-content;
`
export const Separator = styled(Box)`
  width: 100%;
  height: 1px;
  background: #fff;
`
export const FoundersWrapper = styled(Flex)`
  width: 100%;
  flex-flow: row wrap;
  justify-content: space-between;
  // align-content: space-between;
  row-gap: 10px;
  // column-gap: 6px;
  > ${Flex} {
    flex: 1 0 170px;
    // &:not(:last-child) {
    //   margin-right: 8px;
    // }
  }
`
export const FoundersContainer = styled(Flex)`
  width: 170px;
  max-width: 170px;
  height: 60px;
  background: #28273066;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  padding: 19px 14px;
  * {
    font-size: 12px;
  }
`

// CUSTOM (COMPLEX) COMPONENTS
// Button group
// Re-doing these buttons because styling from uikit is different from what's on the desigin
export const ButtonMenuRounded = styled(UikitButtonMenu)`
  width: 100%;
  background: #312b39;
`
export const ButtonMenuItemRounded = styled(Button)`
  background: #1d1725;
  box-shadow: none !important;
  color: #d953e9;
`
export const ButtonMenuSquared = styled(UikitButtonMenu)`
  width: 100%;
  background: none;
`
export const ButtonMenuItemSquared = styled(Button)`
  background: #261f30;
  border-radius: 0;
  box-shadow: none !important;

  border-bottom: 2px solid #d953e9;
`

/**
 * @see https://www.benmvp.com/blog/polymorphic-react-components-typescript/
 */
export type AsProps<E extends ElementType = ElementType> = {
  as?: E
}

export type MergeProps<E extends ElementType> = AsProps<E> & Omit<ComponentProps<E>, keyof AsProps>

export type PolymorphicComponentProps<E extends ElementType, P> = P & MergeProps<E>

export type PolymorphicComponent<P, D extends ElementType = 'button'> = <E extends ElementType = D>(
  props: PolymorphicComponentProps<E, P>,
) => ReactElement | null

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as']
}

const InactiveButtonMenuItemSquared: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(
  ButtonMenuItemSquared,
)<InactiveButtonProps>`
  border-bottom: none;
  &:hover:not(:disabled):not(:active) {
    background: #261f30;
  }
`
const InactiveButtonMenuItemRounded: PolymorphicComponent<InactiveButtonProps, 'button'> = styled(
  ButtonMenuItemRounded,
)<InactiveButtonProps>`
  background: none;
  color: #6f767e;
  &:hover:not(:disabled):not(:active) {
    background: #1d1725;
  }
`
export const CustomButtonMenuItemSquared: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = 'primary',
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButtonMenuItemSquared forwardedAs={as} variant={variant} {...props} />
  }

  return <ButtonMenuItemSquared as={as} variant={variant} {...props} />
}

export const CustomButtonMenuItemRounded: PolymorphicComponent<ButtonMenuItemProps, 'button'> = ({
  isActive = false,
  variant = 'primary',
  as,
  ...props
}: ButtonMenuItemProps) => {
  if (!isActive) {
    return <InactiveButtonMenuItemRounded forwardedAs={as} variant={variant} {...props} />
  }

  return <ButtonMenuItemRounded as={as} variant={variant} {...props} />
}

// PROGRESS BAR
const Progress = styled.div<{ currentProgress: string; color: string }>`
  width: ${({ currentProgress }) => `${currentProgress}%`};
  background: ${({ color }) => color};
  height: 100%;
  border-radius: 14px;
`
const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background: white;
  padding: 2px;
  border-radius: 14px;
`
export const ProgressBar: React.FC<{ currentProgress: string }> = ({ currentProgress }) => {
  const getResettingProgress = () => {
    if (Number(currentProgress) > 100) {
      return Number(currentProgress) - Math.floor(Number(currentProgress) / 100) * 100
    }
    return currentProgress
  }
  const getCurrentColor = () => {
    if (Number(currentProgress) > 500) {
      return 'linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)'
    }
    if (Number(currentProgress) > 100) {
      return '#404adb'
    }
    return '#d953e9'
  }

  return (
    <ProgressBarContainer>
      <Progress currentProgress={getResettingProgress()?.toString() || '0'} color={getCurrentColor()} />
    </ProgressBarContainer>
  )
}

// TIMELINE
const TimelineContainer = styled.div`
  width: 100%;
`
const TimelineTrack = styled(Box)`
  width: 100%;
  height: 4px;
  background: white;
  position: relative;
`
const TimelineProgress = styled.div`
  background: #d953e9;
  width: 25%;
  height: 100%;
`
const TimelineStep = styled.div`
  width: 6px;
  height: 18px;
  position: absolute;
  transform: translateY(-50%);
  background: #d953e9;
  border-radius: 6px;
  &:first-child {
    left: 0;
  }
  &:nth-child(2) {
    left: 25%;
  }
  &:nth-child(3) {
    left: 75%;
  }
  &:nth-child(4) {
    left: 100%;
  }
`

export const Timeline = () => {
  return (
    <TimelineContainer>
      <Flex width="100%" position="relative">
        <Box maxWidth="137px" style={{ flex: '1', color: 'white' }} position="absolute" left="0" bottom="0">
          2021 Q4
        </Box>
        <Box
          maxWidth="137px"
          style={{ flex: '1', color: 'white', transform: 'translate(-50%)' }}
          position="absolute"
          left="25%"
          bottom="0"
        >
          2022 Q1
        </Box>
        <Box
          maxWidth="137px"
          style={{ flex: '1', color: 'white', transform: 'translate(-50%)' }}
          position="absolute"
          left="75%"
          bottom="0"
        >
          2022 Q2
        </Box>
        <Box maxWidth="137px" style={{ flex: '1', color: 'white' }} position="absolute" right="0" bottom="0">
          <Text textAlign="right">2022 Q3</Text>
        </Box>
      </Flex>
      <TimelineTrack my="15px">
        <TimelineStep />
        <TimelineStep />
        <TimelineStep />
        <TimelineStep />
        <TimelineProgress />
      </TimelineTrack>
      <Flex width="100%" position="relative">
        <Box maxWidth="137px" style={{ flex: '1', color: 'white' }} position="absolute" left="0">
          Beta Test Huski Finance
        </Box>
        <Box
          maxWidth="137px"
          style={{ flex: '1', color: 'white', transform: 'translate(-50%)' }}
          position="absolute"
          left="25%"
        >
          DAO Launching Campaing
        </Box>
        <Box
          maxWidth="137px"
          style={{ flex: '1', color: 'white', transform: 'translate(-50%)' }}
          position="absolute"
          left="75%"
        >
          DAO Launch
        </Box>
        <Box maxWidth="137px" style={{ flex: '1', color: 'white' }} position="absolute" right="0">
          <Text textAlign="right">Fair Launch Huski Finance</Text>
        </Box>
      </Flex>
    </TimelineContainer>
  )
}
