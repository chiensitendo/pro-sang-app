import { FolderItem, FolderRequest } from "@/types/folder"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CreateFolderState {
    response?: FolderItem,
    loading: boolean,
    error?: string
}
const initialState: CreateFolderState = {
    loading: false
}

const createFolderSlice = createSlice({
    name: 'folder/create',
    initialState: initialState,
    reducers: {
        createFolderAction(state, _: PayloadAction<FolderRequest>) {
            state.response = undefined;
            state.loading = true;
            state.error = undefined;
        },
        createFolderActionSuccess(state, action) {
            state.response = action.payload.data as FolderItem;
            state.loading = false;
            state.error = undefined;
        },
        createFolderActionFailed(state, action: PayloadAction<string>) {
            state.response = undefined;
            state.loading = false;
            if (action.payload) {
                state.error = action.payload;
            }
        },
        clearCreateFolderError(state) {
            if (state.error) {
                state.error = undefined;
            }
        },
        clearCreateFolderResponse(state) {
            state.response = undefined;
            state.loading = false;
            state.error = undefined;
        }
    }
});

export const {createFolderAction, createFolderActionSuccess, createFolderActionFailed, clearCreateFolderError, clearCreateFolderResponse} = createFolderSlice.actions;

export default createFolderSlice.reducer;