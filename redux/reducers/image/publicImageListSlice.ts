import { ImageItem, ImageResponse } from "@/types/folder"
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface PublicImageListAction {
    limit: number,
    offset: number
}

interface PublicImageListState {
    count: number,
    images?: Array<ImageItem>,
    loading: boolean,
    limit: number,
    offset: number,
    prevLimit: number,
    prevOffset: number,
    folderName?: string
}
const initialState: PublicImageListState = {
    count: 0, 
    loading: false,
    limit: 20,
    offset: 0,
    prevOffset: 0,
    prevLimit: 20
}

const publicImageListSlice = createSlice({
    name: 'image/public/list',
    initialState: initialState,
    reducers: {
        fetchPublicImageList(state, action: PayloadAction<PublicImageListAction>) {
            state.images = undefined;
            state.count = 0;
            state.loading = true;
        },
        fetchPublicImageListSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = images;
            state.count = count;
            state.loading = false;
        },
        fetchPublicImageListFailed(state) {
            state.images = undefined;
            state.count = 0;
            state.loading = false;
            state.folderName = undefined;
        },
        fetchNextPublicImageList(state, action: PayloadAction<PublicImageListAction>) {
            state.prevOffset = state.offset;
            state.offset = action.payload.offset;
            state.loading = true;
        },
        fetchNextPublicImageListSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = !state.images? images: [...state.images, ...images];
            state.count = count;
            state.loading = false;
        },
        fetchNextPublicImageListFailed(state) {
            state.loading = false;
            state.offset = state.prevOffset;
        },
        changePublicImageListLimit(state, action: PayloadAction<PublicImageListAction>) {
            state.prevLimit = state.limit;
            state.limit = action.payload.limit;

            state.prevOffset = state.offset;
            state.offset = 0;
            state.loading = true;
        },
        changePublicImageListLimitSuccess(state, action) {
            const {count, images} = action.payload.data as ImageResponse;
            state.images = images;
            state.count = count;
            state.loading = false;
        },
        changePublicImageListLimitFailed(state) {
            state.loading = false;
            state.limit = state.prevLimit;
            state.offset = state.prevOffset;
        }
    }
});

export const {fetchPublicImageList, fetchPublicImageListSuccess, fetchPublicImageListFailed,
    fetchNextPublicImageList, fetchNextPublicImageListSuccess, fetchNextPublicImageListFailed,
    changePublicImageListLimit, changePublicImageListLimitSuccess, changePublicImageListLimitFailed} = publicImageListSlice.actions;

export default publicImageListSlice.reducer;