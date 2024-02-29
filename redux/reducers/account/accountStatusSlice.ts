import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AccountVerifyRequest, AccountVerifyResponse} from "../../../types/account";

interface AccountStatusState {
    isSubmit: boolean,
    isError: boolean,
    isVerified: boolean,
    isActive: boolean
}

const initialState: AccountStatusState = {
    isSubmit: false,
    isError: false,
    isVerified: false,
    isActive: false
}

const accountStatusSlice = createSlice({
    name: 'account/status',
    initialState: initialState,
    reducers: {
        getAccountStatus(state, action: PayloadAction<{locale: string | undefined}>) {
            
        },
        getAccountStatusSuccess(state, action) {
            state.isSubmit = true;
            state.isError = false;
            const response = action.payload.data as AccountVerifyResponse;
            state.isVerified = response?.is_verified;
            state.isActive = response?.is_active;
        },
        getAccountStatusFailed(state) {
            state.isSubmit = true;
            state.isVerified = false;
            state.isError = true;
        }
    }
});

export const {getAccountStatus, getAccountStatusSuccess, getAccountStatusFailed} = accountStatusSlice.actions;

export default accountStatusSlice.reducer;