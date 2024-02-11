import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification, showMessageNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { getAdminSystemData, getJobList, syncFolders, syncImagesInFolder } from "@/apis/admin-apis";
import { fetchJobListSuccess, fetchSystemDataFailed, fetchSystemDataSuccess, refreshJobList, refreshJobListFailed, refreshJobListSuccess, syncFolderActionFailed, syncFolderActionSuccess, syncImagesInFolderActionFailed, syncImagesInFolderActionSuccess } from "@/redux/reducers/admin/adminSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { MAX_ITEM } from "@/types/page";
const {setLoading} = useLoading();

export function* fetchSystemDataAPI() {
    try {
        // setLoading(true);
        let result: Response = yield getAdminSystemData({});
        yield put(fetchSystemDataSuccess(result));
        // setLoading(false);
    } catch (e) {
        // setLoading(false);
        yield put(fetchSystemDataFailed());
        yield put(showErrorNotification(e));
    }
}

export function* fetchJobListAPI(action: PayloadAction<{limit: number, offset: number}>) {
    try {
        const {limit, offset} = action.payload;
        let result: Response = yield getJobList({limit: limit, offset: offset});
        yield put(fetchJobListSuccess(result));
    } catch (e) {
        yield put(fetchSystemDataFailed());
        yield put(showErrorNotification(e));
    }
}

export function* refreshJobListAPI(action: PayloadAction<{limit: number, offset: number}>) {
    try {
        const {limit, offset} = action.payload;
        let result: Response = yield getJobList({limit: limit, offset: offset});
        yield put(refreshJobListSuccess(result));
    } catch (e) {
        yield put(refreshJobListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* fetchNextJobListAPI(action: PayloadAction<{limit: number, page: number}>) {
    try {
        const {limit, page} = action.payload;
        let result: Response = yield getJobList({limit: limit, offset: (page - 1) * limit});
        yield put(refreshJobListSuccess(result));
    } catch (e) {
        yield put(refreshJobListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* syncFoldersAPI(action: PayloadAction<string[]>) {
    try {
        setLoading(true);
        let result: Response = yield syncFolders({folders: action.payload});
        yield put(syncFolderActionSuccess(result));
        
        setLoading(false);
        yield put (showMessageNotification((result as any).data));
    } catch (e) {
        setLoading(false);
        yield put(syncFolderActionFailed());
        yield put(showErrorNotification(e));
    }
}

export function* syncImagesInFoldersAPI(action: PayloadAction<number>) {
    try {
        setLoading(true);
        let result: Response = yield syncImagesInFolder(action.payload);
        yield put(syncImagesInFolderActionSuccess(result));
        
        setLoading(false);
        yield put (showMessageNotification((result as any).data));
        yield put(refreshJobList({
            limit: MAX_ITEM,
            offset: 0
        }));
    } catch (e) {
        setLoading(false);
        yield put(syncImagesInFolderActionFailed());
        yield put(showErrorNotification(e));
    }
}

function* adminSaga() {
    yield all([
        takeLatest("admin/fetchSystemData", fetchSystemDataAPI),
        takeLatest("admin/syncFolderAction", syncFoldersAPI),
        takeLatest("admin/syncImagesInFolderAction", syncImagesInFoldersAPI),
        takeLatest("admin/fetchJobList", fetchJobListAPI),
        takeLatest("admin/refreshJobList", refreshJobListAPI),
        takeLatest("admin/fetchNextJobList", fetchNextJobListAPI),
    ]);
}

export default adminSaga;