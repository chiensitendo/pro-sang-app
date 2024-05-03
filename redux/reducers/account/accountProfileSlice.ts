import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UpdateUserResponse, UserInfoResponse} from "../../../types/account";
import moment from "moment";

interface AccountProfileState {
    isCompleted: boolean,
    isError: boolean,
    data?: UserInfoResponse,
    loading: boolean
}

const initialState: AccountProfileState = {
    isCompleted: false,
    isError: false,
    loading: false
}

const accountProfileSlice = createSlice({
    name: 'account/profile',
    initialState: initialState,
    reducers: {
        getAccountInfo(state, action: PayloadAction<{locale: string | undefined}>) {
            state.loading = true;
        },
        getAccountInfoSuccess(state, action) {
            state.isCompleted = true;
            state.isError = false;
            state.loading = false;
            state.data = action.payload.data as UserInfoResponse;
        },
        getAccountInfoFailed(state) {
            state.isCompleted = true;
            state.isError = true;
            state.loading = false;
        },
        updateAccountInfo(state, action: PayloadAction<UpdateUserResponse>) {
            if (state.data) {
                state.data.first_name = action.payload.first_name;
                state.data.last_name = action.payload.last_name;
                state.data.updated_time = moment().format("YYYY-MM-DD HH:mm:ss")
            }
        }
    }
});

export const {getAccountInfo, getAccountInfoSuccess, getAccountInfoFailed, updateAccountInfo} = accountProfileSlice.actions;

export default accountProfileSlice.reducer;