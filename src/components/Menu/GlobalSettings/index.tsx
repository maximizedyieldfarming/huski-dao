import React from 'react'
import { Flex, IconButton,NotificationIcon, CogIcon, useModal } from 'husky-uikit1.0'
import SettingsModal from './SettingsModal'

const GlobalSettings = () => {
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <Flex>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" mr="8px">
        <CogIcon height={22} width={22} color="textSubtle" />
      </IconButton>
      <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" mr="8px">
        <NotificationIcon height={22} width={22} color="textSubtle" />
      </IconButton>
    </Flex>
  )
}

export default GlobalSettings
