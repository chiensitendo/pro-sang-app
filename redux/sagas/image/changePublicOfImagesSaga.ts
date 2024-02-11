import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { PayloadAction } from "@reduxjs/toolkit";
import { changeAllPublicOfImagesAPI, changePublicOfImagesAPI } from "@/apis/image-apis";
import { PublicImageRequest } from "@/types/folder";
import { changeAllPublicOfImagesFailed, changeAllPublicOfImagesSuccess, changePublicOfImagesFailed, changePublicOfImagesSuccess } from "@/redux/reducers/image/folderImageListSlice";

const {setLoading} = useLoading();



export function* changePublicOfImagesAPISaga(action: PayloadAction<PublicImageRequest>) {
    try {
        setLoading(true);
        let result: Response = yield changePublicOfImagesAPI({request: action.payload});
        yield put(changePublicOfImagesSuccess(action.payload));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(changePublicOfImagesFailed());
        yield put(showErrorNotification(e));
    }
}

export function* changeAllPublicOfImagesAPISaga(action: PayloadAction<{folderId: number, request: PublicImageRequest}>) {
    try {
        const {folderId, request} = action.payload;
        setLoading(true);
        let result: Response = yield changeAllPublicOfImagesAPI({folderId, request});
        yield put(changeAllPublicOfImagesSuccess(action.payload.request));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(changeAllPublicOfImagesFailed());
        yield put(showErrorNotification(e));
    }
}


function* changePublicOfImagesSaga() {
    yield all([
        takeLatest("image/folder/list/changePublicOfImages", changePublicOfImagesAPISaga),
        takeLatest("image/folder/list/changeAllPublicOfImages", changeAllPublicOfImagesAPISaga),
    ]);
}

export default changePublicOfImagesSaga;