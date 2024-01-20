import { FolderItem, UpdateFolderRequest } from "@/types/folder"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface FolderListState {
    folder?: FolderItem,
    loading: boolean
}
const initialState: FolderListState = {
    loading: false
}

const folderDetailSlice = createSlice({
    name: 'folder/detail',
    initialState: initialState,
    reducers: {
        fetchFolderById(state, action: PayloadAction<number>) {
            state.folder = undefined;
            state.loading = true;
        },
        fetchFolderByIdSuccess(state, action) {
            state.folder = action.payload.data as FolderItem;
            state.loading = false;
        },
        fetchFolderByIdFailed(state) {
            state.folder = undefined;
            state.loading = false;
        },
        updateFolder(state, action: PayloadAction<{id: number, request: UpdateFolderRequest}>) {

        },
        updateFolderSuccess(state, action) {
            state.folder = action.payload.data as FolderItem;
            state.loading = false;
        },
        updateFolderFailed(state) {
            state.loading = false;
        },
    }
});

export const {fetchFolderById, fetchFolderByIdSuccess, fetchFolderByIdFailed, updateFolder, updateFolderSuccess, updateFolderFailed} = folderDetailSlice.actions;

export default folderDetailSlice.reducer;