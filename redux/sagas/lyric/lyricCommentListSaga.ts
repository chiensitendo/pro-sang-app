import {fetchFakeCommandList, fetchFakeLyricList} from "../../../apis/fake-api";
import {all, put, takeLatest} from "@redux-saga/core/effects";
import {
    fetchCommentListFailed,
    fetchCommentListSuccess,
    loadMoreCommentsFail,
    loadMoreCommentsSuccess
} from "../../reducers/lyric/lyricCommentSlice";

export function* fetchCommentDataSaga() {
    try {
        let result: Response = yield fetchFakeCommandList();
        yield put(fetchCommentListSuccess(result));
    } catch (e) {
        yield put(fetchCommentListFailed());
    }
}

export function* loadMoreCommentDataSaga() {
    try {
        let result: Response = yield fetchFakeCommandList();
        yield put(loadMoreCommentsSuccess(result));
    } catch (e) {
        yield put(loadMoreCommentsFail());
    }
}

function* lyricCommentsSaga() {
    yield all([
        takeLatest("lyric/comments/fetchCommentList", fetchCommentDataSaga),
        takeLatest("lyric/comments/loadMoreComments", loadMoreCommentDataSaga)]);
}

export default lyricCommentsSaga;