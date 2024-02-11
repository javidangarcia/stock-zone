import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: JSON.parse(localStorage.getItem("user")) || null,
    reducers: {
        setUser: (state, action) => action.payload,
        clearUser: () => null,
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
