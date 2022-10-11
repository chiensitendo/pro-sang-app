import {all, put, takeLatest} from "@redux-saga/core/effects";
import {fetchFakeLyricContent} from "../../../apis/fake-api";
import {PayloadAction} from "@reduxjs/toolkit";
import {fetchLyricContentFailed, fetchLyricContentSuccess} from "../../reducers/lyric/lyricContentSlice";

export function* fetchContentDataSaga(action: PayloadAction<string>) {
    const ref = action.payload;
    try {
        let result: Response = yield fetchFakeLyricContent(ref);
        yield put(fetchLyricContentSuccess(result));
    } catch (e) {
        yield put(fetchLyricContentFailed());
    }
}

function* lyricContentSaga() {
    yield all([
        takeLatest("lyric/content/fetchLyricContent", fetchContentDataSaga)]);
}

export default lyricContentSaga;