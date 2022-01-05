import styled from 'styled-components'
import { Card as UiKitCard } from '@huskifinance/huski-frontend-uikit'

export const Card = styled(UiKitCard)`
  margin: 0 0px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.card.background};
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};
  // ${({ theme }) => theme.mediaQueries.lg} {
  //   padding: 0px;
  // }
`

export default Card
