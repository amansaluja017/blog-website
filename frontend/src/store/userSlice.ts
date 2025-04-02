import { createSlice } from "@reduxjs/toolkit";

const localData = sessionStorage.getItem("userData")
  ? JSON.parse(sessionStorage.getItem("userData") as string)
  : null;
const localStatus = sessionStorage.getItem("status")
  ? JSON.parse(sessionStorage.getItem("status") as string)
  : false;

const initialState = { userData: localData, status: localStatus };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signup: (state, action) => {
      state.userData = action.payload;
      state.status = true;
    },
    login: (state, action) => {
      state.userData = action.payload;
      state.status = true;
      sessionStorage.setItem("userData", JSON.stringify(action.payload));
      sessionStorage.setItem("status", JSON.stringify(true));
    },
    logout: (state) => {
      state.userData = null;
      state.status = false;
      sessionStorage.clear();
      sessionStorage.setItem("status", JSON.stringify(false));
    },
    Update: (state, action) => {
      state.userData = action.payload;
      sessionStorage.setItem("userData", JSON.stringify(action.payload));
    },
  },
});

export const { signup, login, logout, Update } = userSlice.actions;

export default userSlice.reducer;
