import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AccountLogoutState {
    isSubmit: boolean;
    isComplete: boolean;
}

const initialState: AccountLogoutState = {
    isSubmit: false,
    isComplete: false
}

const accountLogoutSlice = createSlice({
    name: 'account/logout',
    initialState: initialState,
    reducers: {
        logout(state, action: PayloadAction<{sessionId: string, locale: string | undefined}>) {
            state.isSubmit = true;
        },
        logoutSuccess(state, action) {
            state.isSubmit = false;
            state.isComplete = true;
        },
        logoutFailed(state) {
            state.isSubmit = false;
            state.isComplete = true;
        }
    }
});

export const {logout, logoutSuccess, logoutFailed} = accountLogoutSlice.actions;

export default accountLogoutSlice.reducer;