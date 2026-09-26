import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface AccessState {
  roleAccess: string[];
}

const initialState: AccessState = {
  roleAccess: [],
};

export const accessSlice = createSlice({
  name: "access",
  initialState,
  reducers: {
    setRoleAccess(state, action: PayloadAction<string[]>) {
      state.roleAccess = action.payload;
    },
    clearAccess(state) {
      state.roleAccess = [];
    },
  },
});

export const { setRoleAccess, clearAccess } = accessSlice.actions;

export const selectRoleAccess = (state: RootState) => state.access.roleAccess;

export const hasPermission = (permission: string) =>
  (state: RootState): boolean =>
    state.access.roleAccess.includes(permission);

export const hasAnyOf = (permissions: string[]) =>
  (state: RootState): boolean =>
    permissions.some((p) => state.access.roleAccess.includes(p));

export const hasAllOf = (permissions: string[]) =>
  (state: RootState): boolean =>
    permissions.every((p) => state.access.roleAccess.includes(p));

export default accessSlice.reducer;

// On login, dispatch setRoleAccess(loginResponse.permissions) where
// `permissions` is the same array you put in the JWT payload on the
// backend (see app/models/role.py). Re-dispatch it whenever you
// refresh the user's session so role edits take effect.