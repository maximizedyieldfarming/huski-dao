import React from 'react'
import {
  Box,
  Flex,
  Button,
  ButtonMenu as UikitButtonMenu,
  ButtonMenuItem as UikitButtonMenuItem,
} from '@huskifinance/huski-frontend-uikit'
import styled, { css } from 'styled-components'

export const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 0 125px;
`
export const Body = styled(Flex)`
  width: 100%;
  // height: 100vh;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 125px;
    flex-direction: row;
    // justify-content: space-between;
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
  // padding: 20px;
  width: 100%;
  max-width: 513px;
  flex-direction: column;
  align-items: center;
`
export const Footer = styled(Box)``
const gradientBorder = css`
  display: flex;
  align-items: center;
  width: 90%;
  margin: auto;
  max-width: 22em;

  position: relative;
  padding: 1rem;
  // box-sizing: border-box;

  background-clip: padding-box; /* !importanté */
  border: 2px solid transparent; /* !importanté */

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -2px; /* !importanté */
    border-radius: inherit; /* !importanté */
    background: linear-gradient(to right, red, orange);
  }
`
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
// Button group
const StyledButtonGroup = styled(Flex)<{ amount?: boolean; disabled?: boolean }>`
  width: 100%;
  background: ${({ amount }) => (amount ? ' #312B39' : 'transparent')};
  height: ${({ amount }) => (amount ? ' 54px' : '50px')};
  border-radius: ${({ amount }) => (amount ? '12px' : '0')};
  padding: ${({ amount }) => (amount ? '4px' : '0')};
  > ${StyledButton} {
    flex: 1;
    &:not(:last-child) {
      margin-right: ${({ amount }) => (amount ? '0' : '5px')};
    }
    background: ${({ amount }) => (amount ? 'transparent' : null)};
    border-radius: ${({ amount }) => (amount ? '12px' : '0')};
  }
`
export const ButtonGroupItem = styled(StyledButton)`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #261f30;
  border: none;
  border-radius: 0px;
  > * {
    font-weight: 600;
  }
`

export const ButtonGroup = ({ activeIndex = 0, onItemClick, disabled, children, ...props }) => {
  return (
    <StyledButtonGroup {...props} disabled={disabled}>
      {React.Children.map(children, (child: React.ReactElement, index) => {
        return React.cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          disabled,
        })
      })}
    </StyledButtonGroup>
  )
}

export const ProgressBar = styled.div<{ currentProgress: number }>``
