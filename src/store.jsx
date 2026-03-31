import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const storedUser = JSON.parse(localStorage.getItem("user"));

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: {
      user: storedUser ? storedUser : null,
    },
  },
});
