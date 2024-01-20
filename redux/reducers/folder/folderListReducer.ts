import { FolderItem, FolderResponse } from "@/types/folder"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface FolderListState {
    count: number,
    folders?: Array<FolderItem>,
    loading: boolean
}
const initialState: FolderListState = {
    count: 0,
    loading: false
}

const folderListSlice = createSlice({
    name: 'folder/list',
    initialState: initialState,
    reducers: {
        fetchFolderList(state) {
            state.folders = undefined;
            state.count = 0;
            state.loading = true;
        },
        fetchFolderListSuccess(state, action) {
            const {count, folders} = action.payload.data as FolderResponse;
            state.folders = folders;
            state.count = count;
            state.loading = false;
        },
        fetchFolderListFailed(state) {
            state.folders = undefined;
            state.count = 0;
            state.loading = false;
        },
    }
});

export const {fetchFolderList, fetchFolderListSuccess, fetchFolderListFailed} = folderListSlice.actions;

export default folderListSlice.reducer;