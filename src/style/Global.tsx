import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@huskifinance/huski-frontend-uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    // font-family: 'Kanit', sans-serif;
    font-family: 'Inter', sans-serif;
  }
  body {
    background-color: ${({ theme }) => theme.colors.background};
  

    img {
      height: auto;
      max-width: 100%;
    }
    input{
      box-shadow : none!important;
    }
    input:focus{
      outline: none!important;
      box-shadow : none!important;
  }
  }
`

export default GlobalStyle
