import {PayloadAction} from "@reduxjs/toolkit";
import {all, put, takeLatest} from "@redux-saga/core/effects";
import {
    addNewCommentFailed,
    addNewCommentSuccess,
    addNewReplyCommentFailed,
    addNewReplyCommentSuccess,
    fetchLyricInfoFailed,
    fetchLyricInfoSuccess,
    likeCommentFailed,
    likeCommentSuccess,
    likeReplyCommentFailed,
    likeReplyCommentSuccess,
    loadMoreCommentsFailed,
    loadMoreCommentsSuccess,
    rateLyricFailed,
    rateLyricSuccess,
    seeMoreCommentsFailed,
    seeMoreCommentsSuccess,
    showRepliedCommentListFailed,
    showRepliedCommentListSuccess,
    triggerReplyBoxFailed,
    triggerReplyBoxSuccess,
} from "../../reducers/lyric/lyricInfoSlice";
import {
    LyricAddCommentRequest,
    LyricAddReplyRequest,
    LyricLikeCommentRequest,
    LyricLikeReplyRequest, LyricRateRequest
} from "../../../types/lyric";
import {
    addNewCommentAPI,
    addNewReplyCommentAPI,
    likeCommentAPI,
    likeReplyAPI,
    rateLyricAPI
} from "../../../apis/lyric-apis";
import {showErrorNotification} from "../../reducers/lyric/notificationSlice";
import {getLyricInfo, getLyricRepliedComments, loadMoreCommentsAPI} from "../../../apis/common/lyric-public-api";
import {useLoading} from "../../../components/core/useLoading";
const {setLoading} = useLoading();
export function* fetchLyricDataSaga(action: PayloadAction<{ref: string, locale: string | undefined}>) {
    const {ref, locale} = action.payload;
    try {
        setLoading(true);
        let result: Response = yield getLyricInfo(ref, locale);
        yield put(fetchLyricInfoSuccess(result));
        setLoading(false);
    } catch (e) {
        setLoading(false);
        const error = e as any;
        yield put(fetchLyricInfoFailed(error?.status));
        yield put(showErrorNotification(e));
    }
}

export function* showRepliedCommentsSaga(action: PayloadAction<{lyricId: number, commendId: number, offset: number, locale: string | undefined}>) {
    const {lyricId, commendId, offset, locale} = action.payload;
    try {
        let result: Response = yield getLyricRepliedComments(lyricId, commendId, offset, locale);
        yield put(showRepliedCommentListSuccess(result));
    } catch (e) {
        yield put(showRepliedCommentListFailed());
        yield put(showErrorNotification(e));
    }
}

export function* showRepliedCommentsWhenTriggerReplyBoxSaga(action: PayloadAction<{lyricId: number, commendId: number, offset: number, shouldLoad: boolean, locale: string | undefined}>) {
    const {lyricId, commendId, offset, shouldLoad, locale} = action.payload;
    if (!shouldLoad) {
        yield put(triggerReplyBoxSuccess({
            isLoaded: false,
            commendId,
            data: null
        }));
        return
    }
    try {
        let result: Response = yield getLyricRepliedComments(lyricId, commendId, offset, locale);
        yield put(triggerReplyBoxSuccess({
            isLoaded: true,
            commendId,
            data: result
        }));
    } catch (e) {
        yield put(triggerReplyBoxFailed());
        yield put(showErrorNotification(e));
    }
}

export function* seeMoreCommentsSaga(action: PayloadAction<{lyricId: number, commendId: number, offset: number, locale: string | undefined}>) {
    const {lyricId, commendId, offset, locale} = action.payload;
    try {
        let result: Response = yield getLyricRepliedComments(lyricId, commendId, offset, locale);
        yield put(seeMoreCommentsSuccess(result));
    } catch (e) {
        yield put(seeMoreCommentsFailed());
        yield put(showErrorNotification(e));
    }
}

export function* likeCommentSaga(action: PayloadAction<{request: LyricLikeCommentRequest, locale: string | undefined}>) {
    const {request, locale} = action.payload;
    try {
        let result: Response = yield likeCommentAPI(request, locale);
        yield put(likeCommentSuccess(result));

    } catch (e) {
        yield put(likeCommentFailed());
        yield put(showErrorNotification(e));
    }
}

export function* likeReplySaga(action: PayloadAction<{request: LyricLikeReplyRequest, locale: string | undefined}>) {
    const {request, locale} = action.payload;
    try {
        let result: Response = yield likeReplyAPI(request, locale);
        yield put(likeReplyCommentSuccess(result));
    } catch (e) {
        yield put(likeReplyCommentFailed());
        yield put(showErrorNotification(e));
    }
}

export function* addNewCommentSaga(action: PayloadAction<{request: LyricAddCommentRequest, locale: string | undefined}>) {
    const {request,locale} = action.payload;
    try {
        let result: Response = yield addNewCommentAPI(request, locale);
        yield put(addNewCommentSuccess(result));
    } catch (e) {
        yield put(addNewCommentFailed());
        yield put(showErrorNotification(e));
    }
}

export function* addNewReplyCommentSaga(action: PayloadAction<{request: LyricAddReplyRequest, locale: string | undefined}>) {
    const {request, locale} = action.payload;
    try {
        let result: Response = yield addNewReplyCommentAPI(request, locale);
        yield put(addNewReplyCommentSuccess(result));
    } catch (e) {
        yield put(addNewReplyCommentFailed());
        yield put(showErrorNotification(e));
    }
}

export function* loadMoreCommentsSaga(action: PayloadAction<{lyricId: number, offset: number, locale: string | undefined}>) {
    const {lyricId, offset, locale} = action.payload;
    try {
        let result: Response = yield loadMoreCommentsAPI(lyricId, offset, locale);
        yield put(loadMoreCommentsSuccess(result));
    } catch (e) {
        yield put(loadMoreCommentsFailed());
        yield put(showErrorNotification(e));
    }
}

export function* rateLyricSaga(action: PayloadAction<{lyricId: number, req: LyricRateRequest, locale: string | undefined}>) {
    const {lyricId, req, locale} = action.payload;
    try {
        let result: Response = yield rateLyricAPI(lyricId, req, locale);
        yield put(rateLyricSuccess(result));
    } catch (e) {
        yield put(rateLyricFailed());
        yield put(showErrorNotification(e));
    }
}

function* lyricInfoSaga() {
    yield all([
        takeLatest("lyric/info/fetchLyricInfo", fetchLyricDataSaga),
        takeLatest("lyric/info/showRepliedCommentList", showRepliedCommentsSaga),
        takeLatest("lyric/info/likeComment", likeCommentSaga),
        takeLatest("lyric/info/likeReplyComment", likeReplySaga),
        takeLatest("lyric/info/addNewComment", addNewCommentSaga),
        takeLatest("lyric/info/addNewReplyComment", addNewReplyCommentSaga),
        takeLatest("lyric/info/seeMoreComments", seeMoreCommentsSaga),
        takeLatest("lyric/info/loadMoreComments", loadMoreCommentsSaga),
        takeLatest("lyric/info/triggerReplyBox", showRepliedCommentsWhenTriggerReplyBoxSaga),
        takeLatest("lyric/info/rateLyric", rateLyricSaga),
    ]);
}

export default lyricInfoSaga;