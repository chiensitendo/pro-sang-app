import {all, put, takeLatest} from "@redux-saga/core/effects";
import {showErrorNotification} from "../../reducers/notificationSlice";
import {useLoading} from "../../../components/core/useLoading";
import { getFolderListAPI } from "@/apis/folder-apis";
import { fetchFolderListFailed, fetchFolderListSuccess } from "@/redux/reducers/folder/folderListReducer";
const {setLoading} = useLoading();

export function* getFolderListSaga() {
    try {
        setLoading(true);
        let result: Response = yield getFolderListAPI();
        yield put(fetchFolderListSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        yield put(fetchFolderListFailed());
        yield put(showErrorNotification(e));
    }
}

function* folderListSaga() {
    yield all([
        takeLatest("folder/list/fetchFolderList", getFolderListSaga)
    ]);
}

export default folderListSaga;