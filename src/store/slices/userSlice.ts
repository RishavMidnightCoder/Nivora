import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface UserState {
  userData: {
    token?: string;
    user_id?: string;
    user_name?: string;
    user_email?: string;
    role_name?: string;
    role_id?: string;
  };
}

const initialState: UserState = {
  userData: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState["userData"]>) => {
      state.userData = action.payload;
    },
    clearUserData: (state) => {
      state.userData = {};
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export const selectUserData = (state: RootState) => state.user.userData;

export default userSlice.reducer;