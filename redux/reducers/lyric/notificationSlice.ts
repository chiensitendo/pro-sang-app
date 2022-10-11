import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface NotificationState {
    error: any,
    message: any,
}

const initialState: NotificationState = {
    error: null,
    message: null,
}


const notificationSlice = createSlice({
    name: 'lyric/notification',
    initialState: initialState,
    reducers: {
        showErrorNotification(state, action: PayloadAction<any>) {
            state.error = action.payload;
        },
        removeErrorNotification(state) {
            state.error = null;
        }
    }
});

export const {showErrorNotification, removeErrorNotification} = notificationSlice.actions;

export default notificationSlice.reducer;