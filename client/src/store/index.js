import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

function loadState() {
  try {
    const serialized = localStorage.getItem("app_state");
    if (!serialized) return undefined;
    const parsed = JSON.parse(serialized);
    return { auth: parsed.auth };
  } catch (e) {
    console.warn("Failed to load state from localStorage", e);
    return undefined;
  }
}

function saveState(state) {
  try {
    const toSave = { auth: state.auth };
    localStorage.setItem("app_state", JSON.stringify(toSave));
  } catch (e) {
    console.warn("Failed to save state to localStorage", e);
  }
}

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
