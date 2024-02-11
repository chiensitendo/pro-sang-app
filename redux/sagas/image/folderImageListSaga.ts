import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { getImageListByFolderIdAPI } from "@/apis/image-apis";
import { FolderImageListAction, changeFolderImageListLimitFailed, changeFolderImageListLimitSuccess, 
    fetchFolderImageListFailed, fetchFolderImageListSuccess, fetchNextFolderImageListFailed, fetchNextFolderImageListSuccess, refreshFolderImageListFailed, refreshFolderImageListSuccess } from "@/redux/reducers/image/folderImageListSlice";
const {setLoading} = useLoading();

export function* getImageFolderListSaga(action: PayloadAction<FolderImageListAction>) {
    try {
        const {folderId, limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getImageListByFolderIdAPI({folderId, limit, offset});
        yield put(fetchFolderImageListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchFolderImageListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* refreshImageFolderListSaga(action: PayloadAction<FolderImageListAction>) {
    try {
        const {folderId, limit, offset} = action.payload;
        setLoading(true);
        let result: Response = yield getImageListByFolderIdAPI({folderId, limit, offset});
        yield put(refreshFolderImageListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(refreshFolderImageListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* getNextFolderImageListSaga(action: PayloadAction<FolderImageListAction>) {
    try {
        const {folderId, limit, offset} = action.payload;
        // setLoading(true);
        let result: Response = yield getImageListByFolderIdAPI({folderId, limit, offset});
        yield put(fetchNextFolderImageListSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(fetchNextFolderImageListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* changeFolderImageListLimitSaga(action: PayloadAction<FolderImageListAction>) {
    try {
        const {folderId, limit, offset} = action.payload;
        // setLoading(true);
        let result: Response = yield getImageListByFolderIdAPI({folderId, limit, offset});
        yield put(changeFolderImageListLimitSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(changeFolderImageListLimitFailed());
        yield put(showErrorNotification(e));
    }
}

function* folderImageListSaga() {
    yield all([
        takeLatest("image/folder/list/fetchFolderImageList", getImageFolderListSaga),
        takeLatest("image/folder/list/refreshFolderImageList", refreshImageFolderListSaga),
        takeLatest("image/folder/list/fetchNextFolderImageList", getNextFolderImageListSaga),
        takeLatest("image/folder/list/changeFolderImageListLimit", changeFolderImageListLimitSaga),
    ]);
}

export default folderImageListSaga;