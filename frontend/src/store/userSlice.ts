import {createSlice} from "@reduxjs/toolkit";

const localData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") as string) : null;
const localStatus = localStorage.getItem("status") ? JSON.parse(localStorage.getItem("status") as string) : false;

const initialState = {userData: localData, status: localStatus};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signup: (state, action) => {
            state.userData = action.payload;
            state.status = true;
        },
        login: (state, action) => {
            state.userData = action.payload;
            state.status = true;
            localStorage.setItem("userData", JSON.stringify(action.payload));
            localStorage.setItem("status", JSON.stringify(true));
        },
        logout: (state) => {
            state.userData = null;
            state.status = false;
            localStorage.removeItem("userData");
            localStorage.setItem("status", JSON.stringify(false));
        },
    },
});

export const {signup, login, logout} = userSlice.actions;

export default userSlice.reducer;