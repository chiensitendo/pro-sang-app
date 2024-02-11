import { AdminFolderItem, AdminResponse, JobItem, JobResponse } from "@/types/admin";
import { MAX_ITEM } from "@/types/page";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


interface JobState {
    limit: number,
    offset: number,
    prevLimit: number,
    prevOffset: number,
    prevPage: number,
    jobs?: JobItem[],
    count: number,
    loading: boolean,
    page: number
}
interface AdminState {
    folders?: Array<AdminFolderItem>,
    loading: boolean,
    syncLoading: boolean,
    syncImagesLoading: boolean,
    job: JobState
}
const initialState: AdminState = {
    loading: false,
    syncLoading: false,
    syncImagesLoading: false,
    job: {
        limit: MAX_ITEM,
        offset: 0,
        prevLimit: MAX_ITEM,
        prevOffset: 0,
        jobs: [],
        count: 0,
        loading: false,
        page: 1,
        prevPage: 1
    }
}

const adminSlice = createSlice({
    name: 'admin',
    initialState: initialState,
    reducers: {
        fetchSystemData(state) {
            state.folders = undefined;
            state.loading = true;
        },
        fetchSystemDataSuccess(state, action) {
            const {folders} = action.payload.data as AdminResponse;
            state.folders = folders;
            state.loading = false;
        },
        fetchSystemDataFailed(state) {
            state.folders = undefined;
            state.loading = false;
        },
        syncFolderAction(state, action: PayloadAction<string[]>) {
            state.syncLoading = true;
        },
        syncFolderActionSuccess(state, action) {
            state.syncLoading = false;
        },
        syncFolderActionFailed(state) {
            state.syncLoading = false;
        },
        syncImagesInFolderAction(state, action: PayloadAction<number>) {
            state.syncImagesLoading = true;
        },
        syncImagesInFolderActionSuccess(state, action) {
            state.syncImagesLoading = false;
        },
        syncImagesInFolderActionFailed(state) {
            state.syncImagesLoading = false;
        },
        fetchJobList(state, action: PayloadAction<{limit: number, offset: number}>) {
            state.job.jobs = undefined;
            state.job.count = 0;
            state.job.loading = true;
        },
        fetchJobListSuccess(state, action) {
            const {count, jobs} = action.payload.data as JobResponse;
            state.job.jobs = jobs;
            state.job.count = count;
            state.job.loading = false;
        },
        fetchJobListFailed(state) {
            state.job.jobs = undefined;
            state.job.count = 0;
            state.job.loading = false;
        },
        refreshJobList(state, action: PayloadAction<{limit: number, offset: number}>) {
            state.job.loading = true;

            state.job.prevLimit = state.job.limit;
            state.job.prevOffset = state.job.offset;
            state.job.limit = action.payload.limit;
            state.job.offset = action.payload.offset;
        },
        refreshJobListSuccess(state, action) {
            const {count, jobs} = action.payload.data as JobResponse;
            state.job.jobs = jobs;
            state.job.count = count;
            state.job.loading = false;
        },
        refreshJobListFailed(state) {
            state.job.loading = false;

            state.job.limit = state.job.prevLimit;
            state.job.offset = state.job.prevOffset;
        },
        fetchNextJobList(state, action: PayloadAction<{limit: number, page: number}>) {
            state.job.loading = true;

            state.job.prevLimit = state.job.limit;
            state.job.prevPage = state.job.page;
            state.job.limit = action.payload.limit;
            state.job.page = action.payload.page;
        },
        fetchNextJobListSuccess(state, action) {
            const {count, jobs} = action.payload.data as JobResponse;
            state.job.jobs = jobs;
            state.job.count = count;
            state.job.loading = false;
        },
        fetchNextJobListFailed(state) {
            state.job.loading = false;

            state.job.limit = state.job.prevLimit;
            state.job.page = state.job.prevPage;
        },
    }
});

export const {fetchSystemData, fetchSystemDataSuccess, fetchSystemDataFailed,
    syncFolderAction, syncFolderActionSuccess, syncFolderActionFailed,
    syncImagesInFolderAction, syncImagesInFolderActionSuccess, syncImagesInFolderActionFailed,
    fetchJobList, fetchJobListSuccess, fetchJobListFailed,
    refreshJobList, refreshJobListSuccess, refreshJobListFailed,
    fetchNextJobList, fetchNextJobListSuccess, fetchNextJobListFailed} = adminSlice.actions;

export default adminSlice.reducer;