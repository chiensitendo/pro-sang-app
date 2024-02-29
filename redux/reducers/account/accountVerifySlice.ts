import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AccountVerifyRequest, AccountVerifyResponse} from "../../../types/account";

interface AccountVerifyState {
    isSubmit: boolean,
    isError: boolean,
    isVerified: boolean
}

const initialState: AccountVerifyState = {
    isSubmit: false,
    isError: false,
    isVerified: false
}

const accountVerifySlice = createSlice({
    name: 'account/verify',
    initialState: initialState,
    reducers: {
        verifyAccount(state, action: PayloadAction<{request: AccountVerifyRequest, locale: string | undefined}>) {
            
        },
        verifyAccountSuccess(state, action) {
            state.isSubmit = true;
            state.isError = false;
            const response = action.payload.data as AccountVerifyResponse;
            state.isVerified = response?.is_verified;
        },
        verifyAccountFailed(state) {
            state.isSubmit = true;
            state.isVerified = false;
            state.isError = true;
        }
    }
});

export const {verifyAccount, verifyAccountSuccess, verifyAccountFailed} = accountVerifySlice.actions;

export default accountVerifySlice.reducer;