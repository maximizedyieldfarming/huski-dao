import React from 'react'
import { Flex, IconButton, NotificationIcon, CogIcon, useModal } from '@huskifinance/huski-frontend-uikit'
import SettingsModal from './SettingsModal'

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex>
      <IconButton
        style={{ marginLeft: '5px', marginRight: '-7px', width: '32px' }}
        onClick={onPresentSettingsModal}
        variant="text"
        scale="sm"
      >
        <CogIcon height={22} width={22} color="textSubtle" />
      </IconButton>
      <IconButton
        onClick={onPresentSettingsModal}
        style={{ width: '45px', marginLeft: '6px' }}
        variant="text"
        scale="sm"
        mr="8px"
      >
        <NotificationIcon height={45} width={45} color="textSubtle" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
