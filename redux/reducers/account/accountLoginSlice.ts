import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LoginRequest, LoginResponse} from "../../../types/account";

interface AccountLoginState {
    isSubmit: boolean;
    response: LoginResponse | null;
}

const initialState: AccountLoginState = {
    isSubmit: false,
    response: null
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
            state.response = action.payload.data.body;
        },
        loginFailed(state) {
            state.isSubmit = false;
            state.response = null;
        },
        clearLoginState: (state) => {
            state.isSubmit = false;
            state.response = null;
        }
    }
});

export const {login, loginSuccess, loginFailed, clearLoginState} = accountLoginSlice.actions;

export default accountLoginSlice.reducer;