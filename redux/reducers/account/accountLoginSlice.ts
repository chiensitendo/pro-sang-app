import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoginRequest, LoginResponse, LoginResponseV2} from "../../../types/account";

interface AccountLoginState {
    isSubmit: boolean;
    isTooManyLogin: boolean;
    response: LoginResponseV2 | null;
    isComplete: boolean;
}

const initialState: AccountLoginState = {
    isSubmit: false,
    response: null,
    isTooManyLogin: false,
    isComplete: false
}

const accountLoginSlice = createSlice({
    name: 'account/login',
    initialState: initialState,
    reducers: {
        login(state, action: PayloadAction<{request: LoginRequest, locale: string | undefined}>) {
            state.isSubmit = true;
            state.response = null;
        },
        loginSuccess(state, action) {
            state.isSubmit = false;
            state.isComplete = true;
            state.response = action.payload.data;
        },
        loginFailed(state, action: PayloadAction<boolean>) {
            state.isTooManyLogin = action.payload;
            state.isSubmit = false;
            state.isComplete = true;
            state.response = null;
        },
        clearLoginState: (state) => {
            state.isSubmit = false;
            state.response = null;
            state.isTooManyLogin = false;
            state.isComplete = false;
        }
    }
});

export const {login, loginSuccess, loginFailed, clearLoginState} = accountLoginSlice.actions;

export default accountLoginSlice.reducer;