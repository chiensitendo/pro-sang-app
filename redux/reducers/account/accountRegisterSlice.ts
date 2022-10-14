import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CreateAccountRequest, CreateAccountResponse} from "../../../types/account";

interface AccountRegisterState {
    isSubmit: boolean;
    response: CreateAccountResponse | null;
}

const initialState: AccountRegisterState = {
    isSubmit: false,
    response: null
}

const accountRegisterSlice = createSlice({
    name: 'account/register',
    initialState: initialState,
    reducers: {
        registerAccount(state, action: PayloadAction<{request: CreateAccountRequest, locale: string | undefined}>) {
            state.isSubmit = true;
            state.response = null;
        },
        registerAccountSuccess(state, action) {
            state.isSubmit = false;
            state.response = action.payload.data.body;
        },
        registerAccountFailed(state) {
            state.isSubmit = false;
            state.response = null;
        },
        clearRegisterState: (state) => {
            state.isSubmit = false;
            state.response = null;
        }
    }
});

export const {registerAccount, registerAccountSuccess, registerAccountFailed, clearRegisterState} = accountRegisterSlice.actions;

export default accountRegisterSlice.reducer;