import {createAsyncThunk, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {getCurrentUser, type SessionUser} from "../../services/sessionClient.ts";

type User = SessionUser;

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
        return await getCurrentUser();
    } catch (err) {
      // standardize the error to a string message
        return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User | null | undefined>) => {
      state.isAuthenticated = true;
      state.user = action.payload ?? null;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload.authenticated;
        state.user = action.payload.user ?? null;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as string) || action.error.message || null;
      });
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
