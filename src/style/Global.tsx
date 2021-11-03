import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'
import { RegularFont } from 'assets/fonts'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
@font-face {
        font-family: 'GenJyuuGothic Regular';
        src: url(${RegularFont}) format('woff');
    }
  * {
    // font-family: 'Kanit', sans-serif;
    font-family: 'GenJyuuGothic Regular';
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
  

    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
