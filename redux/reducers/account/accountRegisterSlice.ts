import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CreateAccountResponse, RegisterRequest} from "../../../types/account";

interface AccountRegisterState {
    isSubmit: boolean;
    isSuccess: boolean;
    response: CreateAccountResponse | null;
}

const initialState: AccountRegisterState = {
    isSubmit: false,
    response: null,
    isSuccess: false
}

const accountRegisterSlice = createSlice({
    name: 'account/register',
    initialState: initialState,
    reducers: {
        registerAccount(state, action: PayloadAction<{request: RegisterRequest, locale: string | undefined}>) {
            state.isSubmit = true;
            state.response = null;
        },
        registerAccountSuccess(state, action) {
            state.isSubmit = false;
            state.response = action.payload.data as CreateAccountResponse;
            state.isSuccess = true;
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