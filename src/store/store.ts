import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;

// Export types for the entire Redux setup
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
