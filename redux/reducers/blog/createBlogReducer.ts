import { BlogResponse, CreateBlogRequest } from "@/types/blog";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface CreateBlogState {
    response?: BlogResponse,
    loading: boolean,
    error?: string
}
const initialState: CreateBlogState = {
    loading: false
}

const createBlogSlice = createSlice({
    name: 'blog/create',
    initialState: initialState,
    reducers: {
        createBlogAction(state, _: PayloadAction<CreateBlogRequest>) {
            state.response = undefined;
            state.loading = true;
            state.error = undefined;
        },
        createBlogActionSuccess(state, action) {
            state.response = action.payload.data as BlogResponse;
            state.loading = false;
            state.error = undefined;
        },
        createBlogActionFailed(state, action: PayloadAction<string>) {
            state.response = undefined;
            state.loading = false;
            if (action.payload) {
                state.error = action.payload;
            }
        },
        clearcreateBlogError(state) {
            if (state.error) {
                state.error = undefined;
            }
        },
        clearcreateBlogResponse(state) {
            state.response = undefined;
            state.loading = false;
            state.error = undefined;
        }
    }
});

export const {createBlogAction, createBlogActionSuccess, createBlogActionFailed, clearcreateBlogError, clearcreateBlogResponse} = createBlogSlice.actions;

export default createBlogSlice.reducer;