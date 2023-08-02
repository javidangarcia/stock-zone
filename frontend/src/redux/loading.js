import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: "loading",
    initialState: false,
    reducers: {
        setLoading: (state, action) => action.payload
    }
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
