import {createSlice} from "@reduxjs/toolkit";


interface ShellUserState {
    name: string;
}

const initialState: ShellUserState = {
    name: ''
}

const shellUserSlice = createSlice({
    name: 'shell-user',
    initialState: initialState,
    reducers: {
        fetchShellUserName(_) {

        },
        fetchShellUserNameSuccess(state, action) {
            state.name = action.payload.data.body.name;
        }
    }
});


export const {fetchShellUserName, fetchShellUserNameSuccess} = shellUserSlice.actions;

export default shellUserSlice.reducer;