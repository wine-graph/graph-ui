import { createSlice } from "@reduxjs/toolkit";

type User = {
  id: string;
  name: string;
  mail: string;
};

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  // Add other relevant fields as needed
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
