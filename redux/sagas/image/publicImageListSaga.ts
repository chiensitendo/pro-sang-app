import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import {getPublicImageListAPI } from "@/apis/image-apis";
import { PublicImageListAction, changePublicImageListLimitFailed, changePublicImageListLimitSuccess, fetchNextPublicImageListFailed, fetchNextPublicImageListSuccess, fetchPublicImageListFailed, fetchPublicImageListSuccess } from "@/redux/reducers/image/publicImageListSlice";
const {setLoading} = useLoading();

export function* getImagePublicListSaga(action: PayloadAction<PublicImageListAction>) {
    try {
        const {limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getPublicImageListAPI({limit, offset});
        yield put(fetchPublicImageListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchPublicImageListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getNextPublicImageListSaga(action: PayloadAction<PublicImageListAction>) {
    try {
        const {limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getPublicImageListAPI({limit, offset});
        yield put(fetchNextPublicImageListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchNextPublicImageListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* changePublicImageListLimitSaga(action: PayloadAction<PublicImageListAction>) {
    try {
        const {limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getPublicImageListAPI({limit, offset});
        yield put(changePublicImageListLimitSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(changePublicImageListLimitFailed());
        yield put(showErrorNotification(e));
    }
}


function* publicImageListSaga() {
    yield all([
        takeLatest("image/public/list/fetchPublicImageList", getImagePublicListSaga),
        takeLatest("image/public/list/fetchNextPublicImageList", getNextPublicImageListSaga),
        takeLatest("image/public/list/changePublicImageListLimit", changePublicImageListLimitSaga),
    ]);
}

export default publicImageListSaga;