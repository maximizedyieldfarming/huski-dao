import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfileState, Profile } from 'state/types'
// import type { AppDispatch } from 'state'

const initialState: ProfileState = {
  isInitialized: false,
  isLoading: true,
  hasRegistered: false,
  data: null,
}

export interface GetProfileResponse {
  hasRegistered: boolean
  profile?: Profile
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    profileFetchStart: (state) => {
      state.isLoading = true
    },
    profileFetchSucceeded: (_state, action: PayloadAction<GetProfileResponse>) => {
      const { profile, hasRegistered } = action.payload

      return {
        isInitialized: true,
        isLoading: false,
        hasRegistered,
        data: profile,
      }
    },
    profileFetchFailed: (state) => {
      state.isLoading = false
      state.isInitialized = true
    },
    profileClear: () => ({
      ...initialState,
      isLoading: false,
    }),
    addPoints: (state, action: PayloadAction<number>) => {
      state.data.points += action.payload
    },
  },
})

// Actions
export const { profileFetchStart, profileFetchSucceeded, profileFetchFailed, profileClear, addPoints } =
  profileSlice.actions


export default profileSlice.reducer
