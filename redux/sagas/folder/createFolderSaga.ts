import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { createFolderAPI } from "@/apis/folder-apis";
import { fetchFolderListFailed, fetchFolderListSuccess } from "@/redux/reducers/folder/folderListReducer";
import { PayloadAction } from "@reduxjs/toolkit";
import { FolderRequest } from "@/types/folder";
import { ErrorMessage } from "@/types/error";
import { createFolderActionFailed, createFolderActionSuccess } from "@/redux/reducers/folder/createFolderReducer";
const {setLoading} = useLoading();

export function* createFolder(action: PayloadAction<FolderRequest>) {
    try {
        setLoading(true);
        let result: Response = yield createFolderAPI(action.payload);
        yield put(createFolderActionSuccess(result));
        setLoading(false);
    } catch (e: any) {
        let message = "";
        if (e?.response?.data) {
            const error: ErrorMessage = e?.response?.data;
            if (error.message) {
                message = error.message;
            }
        }
        setLoading(false);
        yield put(createFolderActionFailed(message));
        yield put(showErrorNotification(e));
    }
}

function* createFolderSaga() {
    yield all([
        takeLatest("folder/create/createFolderAction", createFolder)
    ]);
}

export default createFolderSaga;