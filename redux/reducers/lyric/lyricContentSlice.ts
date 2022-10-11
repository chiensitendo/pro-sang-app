import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface LyricContentState {
    content: string;
}

const initialState: LyricContentState = {
    content: ""
}

const lyricContentSlice = createSlice({
    name: 'lyric/content',
    initialState: initialState,
    reducers: {
        fetchLyricContent(state, action: PayloadAction<string>) {

        },
        fetchLyricContentSuccess(state, action) {
            state.content = action.payload.data;
        },
        fetchLyricContentFailed(state) {
            state.content = "";
        },
    }
});

export const {fetchLyricContent, fetchLyricContentSuccess, fetchLyricContentFailed} = lyricContentSlice.actions;

export default lyricContentSlice.reducer;