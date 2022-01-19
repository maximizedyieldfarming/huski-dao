import React from 'react'
import styled from 'styled-components'
import { Button, CogIcon, useModal } from '@huskifinance/huski-frontend-uikit'
import SettingsModal from './SettingsModal'

const SettingsButton = styled(Button)`
  background:transparent;
  background-image:unset;
  box-shadow: unset;
  padding: 0;
  height: fit-content;
  svg {
    margin-right: unset;
    fill: none;
  }
`;

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
      <SettingsButton
        onClick={onPresentSettingsModal}
      >
        <CogIcon width="20px" />
      </SettingsButton>
  )
}

export default GlobalSettings
