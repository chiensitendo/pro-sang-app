import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LyricRequest} from "../../../types/account";
import {LyricEditDetailResponse} from "../../../types/lyric";


export enum LyricActionStatus {
    INITIAL,
    SAVED,
    PUBLISHED
}

interface LyricActionState {
    isLoad: boolean;
    actionStatus: LyricActionStatus,
    detail: LyricEditDetailResponse | null
}

const initialState: LyricActionState = {
    isLoad: false,
    actionStatus: LyricActionStatus.INITIAL,
    detail: null
}

const lyricActionSlice = createSlice({
    name: 'lyric/actions',
    initialState: initialState,
    reducers: {
        addLyric(state, action: PayloadAction<{request: LyricRequest, isSave: boolean, locale: string | undefined}>) {
            state.isLoad = true;
        },
        addLyricSuccess(state, action: PayloadAction<{res: any, isSave: boolean}>) {
            state.isLoad = false;
            const {isSave} = action.payload;
            state.actionStatus = isSave ? LyricActionStatus.SAVED : LyricActionStatus.PUBLISHED;
        },
        addLyricFailed(state) {
            state.isLoad = false;
        },
        editLyric(state, action: PayloadAction<{lyricId: number, request: LyricRequest, isSave: boolean, locale: string | undefined}>) {

        },
        editLyricSuccess(state, action: PayloadAction<{res: any, isSave: boolean}>) {
            state.isLoad = false;
            const {isSave} = action.payload;
            state.actionStatus = isSave ? LyricActionStatus.SAVED : LyricActionStatus.PUBLISHED;
        },
        editLyricFailed(state) {
            state.isLoad = false;
        },
        getLyricDetailForEdit(state, action: PayloadAction<{lyricId: number, locale: string | undefined}>) {

        },
        getLyricDetailForEditSuccess(state, action) {
            state.detail = action.payload.data.body;
        },
        getLyricDetailForEditFailed(state) {

        }
    }
});

export const {
    addLyric,
    addLyricSuccess,
    addLyricFailed,
    getLyricDetailForEdit,
    getLyricDetailForEditSuccess,
    getLyricDetailForEditFailed,
    editLyric,
    editLyricSuccess,
    editLyricFailed
} = lyricActionSlice.actions;

export default lyricActionSlice.reducer;