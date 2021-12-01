import styled from 'styled-components'
import { Card as UiKitCard } from 'husky-uikit1.0'

export const Card = styled(UiKitCard)`
  // max-width: 352px;
  margin: 0 0px 24px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.card.background};
  padding: 1rem;
  box-shadow: ${({ theme }) => theme.card.boxShadow};
  border-radius: ${({ theme }) => theme.radii.card};

  ${({ theme }) => theme.mediaQueries.sm} {
    // margin: 0 12px 46px;
  }
`

export default Card
