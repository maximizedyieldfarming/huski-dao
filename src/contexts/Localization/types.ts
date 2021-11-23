import { ReactText } from 'react'
import { Language } from 'husky-uikit1.0'

export type ContextData = {
  [key: string]: ReactText
}

export interface ProviderState {
  isFetching: boolean
  currentLanguage: Language
}

export interface ContextApi extends ProviderState {
  setLanguage: (language: Language) => void
  t: (key: string, data?: ContextData) => string
}
