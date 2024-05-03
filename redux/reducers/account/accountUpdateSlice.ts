import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UpdateUserRequest, UpdateUserResponse} from "../../../types/account";

interface AccountUpdateState {
    isSubmit: boolean;
    isSuccess: boolean;
    response: UpdateUserResponse | null;
}

const initialState: AccountUpdateState = {
    isSubmit: false,
    response: null,
    isSuccess: false
}

const accountUpdateSlice = createSlice({
    name: 'account/update',
    initialState: initialState,
    reducers: {
        updateAccount(state, action: PayloadAction<{request: UpdateUserRequest, locale: string | undefined}>) {
            state.isSubmit = true;
            state.response = null;
        },
        updateAccountSuccess(state, action) {
            state.isSubmit = false;
            state.response = action.payload.data as UpdateUserResponse;
            state.isSuccess = true;
        },
        updateAccountFailed(state) {
            state.isSubmit = false;
            state.response = null;
        },
        clearUpdateState: (state) => {
            state.isSubmit = false;
            state.response = null;
        }
    }
});

export const {updateAccount, updateAccountSuccess, updateAccountFailed, clearUpdateState} = accountUpdateSlice.actions;

export default accountUpdateSlice.reducer;