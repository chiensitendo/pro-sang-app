import {all, call, put, takeLatest} from "@redux-saga/core/effects";
import {fetchFakeLyricList} from "../../../apis/fake-api";
import {
    fetchListFailed,
    fetchListSuccess,
    loadMoreLyricListFailed,
    loadMoreLyricListSuccess, searchLyricListFailed, searchLyricListSuccess
} from "../../reducers/lyric/lyricListSlice";
import {PayloadAction} from "@reduxjs/toolkit";
import {getLyricInfo, getLyricListAPI} from "../../../apis/common/lyric-public-api";
import {fetchLyricInfoFailed, fetchLyricInfoSuccess} from "../../reducers/lyric/lyricInfoSlice";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
const {setLoading} = useLoading();

export function* fetchDataSaga(action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
    const {offset, searchText, locale} = action.payload;
    try {
        setLoading(true);
        let result: Response = yield getLyricListAPI(offset, searchText, locale);
        yield put(fetchListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* fetchDataSagaWithLoadMore(action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
    const {offset, searchText, locale} = action.payload;
    try {
        let result: Response = yield getLyricListAPI(offset, searchText, locale);
        yield put(loadMoreLyricListSuccess(result));
    } catch (e) {
        yield put(loadMoreLyricListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* searchLyricListSaga(action: PayloadAction<{offset: number, searchText?: string | undefined, locale: string | undefined}>) {
    const {offset, searchText, locale} = action.payload;
    try {
        setLoading(true);
        let result: Response = yield getLyricListAPI(offset, searchText, locale);
        yield put(searchLyricListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(searchLyricListFailed());
        yield put(showErrorNotification(e));
    }
}

function* lyricListSaga() {
    yield all([
        takeLatest("lyric/list/fetchList", fetchDataSaga),
        takeLatest("lyric/list/loadMoreLyricList", fetchDataSagaWithLoadMore),
        takeLatest("lyric/list/searchLyricList", searchLyricListSaga)]);
}

export default lyricListSaga;