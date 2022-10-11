import {all, put, takeLatest} from "@redux-saga/core/effects";
import {PayloadAction} from "@reduxjs/toolkit";
import {LyricRequest} from "../../../types/account";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import {addLyricAPI, editLyricAPI, getEditLyricDetailAPI} from "../../../apis/lyric-apis";
import {
    addLyricFailed,
    addLyricSuccess, editLyricFailed, editLyricSuccess,
    getLyricDetailForEditFailed,
    getLyricDetailForEditSuccess
} from "../../reducers/lyric/lyricActionSlice";
const {setLoading} = useLoading();

export function* addLyricSaga(action: PayloadAction<{request: LyricRequest, isSave: boolean, locale: string | undefined}>) {
    try {
        const {request, isSave, locale} = action.payload;
        setLoading(true);
        let result: Response = yield addLyricAPI(request, locale);
        yield put(addLyricSuccess({res: result, isSave}));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(addLyricFailed());
        yield put(showErrorNotification(e));
    }
}

export function* editLyricSaga(action: PayloadAction<{lyricId: number, request: LyricRequest, isSave: boolean, locale: string | undefined}>) {
    try {
        const {lyricId, request, isSave, locale} = action.payload;
        setLoading(true);
        let result: Response = yield editLyricAPI(lyricId, request, locale);
        yield put(editLyricSuccess({res: result, isSave}));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(editLyricFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getLyricDetailForEditSaga(action: PayloadAction<{lyricId: number, locale: string | undefined}>) {
    try {
        const {lyricId, locale} = action.payload;
        setLoading(true);
        let result: Response = yield getEditLyricDetailAPI(lyricId, locale);
        yield put(getLyricDetailForEditSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(getLyricDetailForEditFailed());
        yield put(showErrorNotification(e));
    }
}

function* lyricActionSaga() {
    yield all([
        takeLatest("lyric/actions/addLyric", addLyricSaga),
        takeLatest("lyric/actions/editLyric", editLyricSaga),
        takeLatest("lyric/actions/getLyricDetailForEdit", getLyricDetailForEditSaga)
    ]);
}

export default lyricActionSaga;