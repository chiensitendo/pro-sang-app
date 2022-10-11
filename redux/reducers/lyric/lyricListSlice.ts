import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LyricListItem, LyricListResponse} from "../../../types/lyric";

interface LyricListState {
    items: Array<any>;
    list: Array<LyricListItem>;
    itemLoading: boolean;
    initLoading: boolean;
    hasNext: boolean;
}

const initialState: LyricListState = {
    items: [],
    list: [],
    itemLoading: false,
    initLoading: true,
    hasNext: false
}

const lyricListSlice = createSlice({
    name: 'lyric/list',
    initialState: initialState,
    reducers: {
        fetchList(state, action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
        },
        searchLyricList(state, action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
            state.initLoading = true;
            state.list = [];
        },
        searchLyricListSuccess(state, action) {
            state.initLoading = false;
            const res: LyricListResponse = action.payload.data.body;
            state.list = res.items;
            state.hasNext = state.list.length < res.total;
        },
        searchLyricListFailed(state) {
            state.initLoading = false;
        },
        fetchListSuccess(state,action) {
            state.initLoading = false;
            const res: LyricListResponse = action.payload.data.body;
            state.list = state.list.concat(res.items);
            state.hasNext = state.list.length < res.total;
        },
        fetchListFailed(state) {
            state.initLoading = false;
        },
        loadMoreLyricList(state, action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
            state.itemLoading = true;
        },
        loadMoreLyricListSuccess(state, action) {
            state.itemLoading = false;
            const res: LyricListResponse = action.payload.data.body;
            state.list = [...state.list, ...res.items];
            state.hasNext = state.list.length < res.total;
            window.dispatchEvent(new Event('resize'));
        },
        loadMoreLyricListFailed(state) {
            state.itemLoading = false;
        }
    },
})

export const {fetchList, fetchListSuccess, fetchListFailed, loadMoreLyricList, loadMoreLyricListSuccess, searchLyricList, searchLyricListSuccess, searchLyricListFailed, loadMoreLyricListFailed} = lyricListSlice.actions;

export default lyricListSlice.reducer;