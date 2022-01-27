import { Box, Flex } from '@huskifinance/huski-frontend-uikit'
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
export const Container = styled(Box)`
  background: linear-gradient(167.86deg, #1d1723 4.99%, #1d1727 92.76%);
  border: 2px solid #282627;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  max-width: 513px;
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
export const StyledButton = styled.button<{ filled?: boolean }>`
  background: ${({ filled }) => (filled ? 'linear-gradient(68.76deg, #5156e3 32.68%, #e253e9 98.95%)' : '#16131e')};
  border: 1px solid white;
  border-radius: 14px;
  color: #fff;
  cursor: pointer;
`
