import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { BlogResponse, ListResponse } from "@/types/blog";

export interface BlogListAction {
    limit: number,
    offset: number,
    sortBy?: string,
    ascending?: boolean
}

interface BlogListState {
    count: number,
    blogs?: Array<BlogResponse>,
    loading: boolean,
    limit: number,
    offset: number,
    prevLimit: number,
    prevOffset: number
}
const initialState: BlogListState = {
    count: 0,
    loading: false,
    limit: 20,
    offset: 0,
    prevOffset: 0,
    prevLimit: 20
}

const blogListSlice = createSlice({
    name: 'blog/list',
    initialState: initialState,
    reducers: {
        fetchBlogList(state, _: PayloadAction<BlogListAction>) {
            state.blogs = undefined;
            state.count = 0;
            state.loading = true;
        },
        fetchBlogListSuccess(state, action) {
            const {count, items} = action.payload.data as ListResponse<BlogResponse>;
            state.blogs = items;
            state.count = count;
            state.loading = false;
        },
        fetchBlogListFailed(state) {
            state.blogs = undefined;
            state.count = 0;
            state.loading = false;
        },
        fetchNextBlogList(state, action: PayloadAction<BlogListAction>) {
            state.prevOffset = state.offset;
            state.offset = action.payload.offset;
            state.loading = true;
        },
        fetchNextBlogListSuccess(state, action) {
            const {count, items} = action.payload.data as ListResponse<BlogResponse>;
            if (!state.blogs) {
                state.blogs = items;
            } else {
                state.blogs = state.blogs.concat(items);
            }
            state.count = count;
            state.loading = false;
        },
        fetchNextBlogListFailed(state) {
            state.loading = false;
            state.offset = state.prevOffset;
        },
        changeBlogListLimit(state, action: PayloadAction<BlogListAction>) {
            state.prevLimit = state.limit;
            state.limit = action.payload.limit;

            state.prevOffset = state.offset;
            state.offset = 0;
            state.loading = true;
        },
        changeBlogListLimitSuccess(state, action) {
            const {count, items} = action.payload.data as ListResponse<BlogResponse>;
            state.blogs = items;
            state.count = count;
            state.loading = false;
        },
        changeBlogListLimitFailed(state) {
            state.loading = false;
            state.limit = state.prevLimit;
            state.offset = state.prevOffset;
        }
    }
});

export const {fetchBlogList, fetchBlogListSuccess, fetchBlogListFailed,
    fetchNextBlogList, fetchNextBlogListSuccess, fetchNextBlogListFailed,
    changeBlogListLimit, changeBlogListLimitSuccess, changeBlogListLimitFailed} = blogListSlice.actions;

export default blogListSlice.reducer;