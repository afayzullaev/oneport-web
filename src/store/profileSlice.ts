import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Profile } from "@/api/profileApi";

interface ProfileState {
  profile: Profile | null;
  hasProfile: boolean;
  profileFetched: boolean;
}

const initialState: ProfileState = {
  profile: null,
  hasProfile: false,
  profileFetched: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
      state.hasProfile = true;
      state.profileFetched = true;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.hasProfile = false;
      state.profileFetched = false;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
