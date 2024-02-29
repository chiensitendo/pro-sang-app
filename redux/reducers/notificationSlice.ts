import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface NotificationState {
    error?: any,
    message: any,
}

const initialState: NotificationState = {
    message: null,
}


const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        showErrorNotification(state, action: PayloadAction<any>) {
            state.error = action.payload;
        },
        removeErrorNotification(state) {
            state.error = undefined;
        },
        showMessageNotification(state, action: PayloadAction<string>) {
            state.message = action.payload;
        },
        removeMessageNotification(state) {
            state.message = null;
        }
    }
});

export const {showErrorNotification, removeErrorNotification, showMessageNotification, removeMessageNotification} = notificationSlice.actions;

export default notificationSlice.reducer;