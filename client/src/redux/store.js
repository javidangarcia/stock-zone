import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loading";
import userReducer from "./user";

export default configureStore({
    reducer: {
        loading: loadingReducer,
        user: userReducer,
    },
});
