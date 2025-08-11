import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {type Profile } from '@/api/profileApi';

interface ProfileState {
  profile: Profile | null;
  hasProfile: boolean;
  isProfileChecked: boolean; // NEW: Track if we've already checked
  isLoading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  hasProfile: false,
  isProfileChecked: false, // Start as false
  isLoading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      state.hasProfile = true;
      state.isProfileChecked = true; // Mark as checked
      state.isLoading = false;
    },
    setNoProfile: (state) => {
      state.profile = null;
      state.hasProfile = false;
      state.isProfileChecked = true; // Mark as checked even if no profile
      state.isLoading = false;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.hasProfile = false;
      state.isProfileChecked = false; // Reset check status
      state.isLoading = false;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProfile, setNoProfile, clearProfile, setProfileLoading } = profileSlice.actions;
export default profileSlice.reducer;