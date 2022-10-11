import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    LyricAddCommentRequest, LyricAddCommentResponse, LyricAddReplyRequest, LyricAddReplyResponse,
    LyricCommentBaseItem,
    LyricCommentItem,
    LyricDetailResponse,
    LyricLikeCommentRequest,
    LyricLikeCommentResponse,
    LyricLikeReplyRequest,
    LyricLikeReplyResponse, LyricLoadMoreResponse, LyricRateRequest, LyricRateResponse,
    LyricRepliedCommentResponse
} from "../../../types/lyric";
import {MAX_REPLY_PER_COMMENT} from "../../../constants/lyric_const";

const MAX_COMMENTS = 5;

interface LyricCommentState {
    loading: boolean,
    hasMore: boolean,
    comments: Array<LyricCommentItem>,
    showReplyBox: boolean,
    replyBoxId: number,
    name: string,
    replyText: string,
    isScrollToBottom: boolean,
    scrollPosition: number,
    isFlashCommentBox: boolean,
    lyricDetail: LyricDetailResponse | null,
    commentBoxLoading: boolean,
    id: number | null,
    offset: number,
    isRated: boolean,
    isRateLoading: boolean,
    isRateSuccess: boolean,
    isNotFound: boolean
}

const initialState: LyricCommentState = {
    hasMore: true,
    comments: [],
    loading: false,
    replyBoxId: -1,
    name: "",
    showReplyBox: false,
    replyText: "",
    isScrollToBottom: false,
    scrollPosition: 0,
    isFlashCommentBox: false,
    lyricDetail: null,
    commentBoxLoading: false,
    id: null,
    offset: 0,
    isRated: false,
    isRateLoading: false,
    isRateSuccess: false,
    isNotFound: false
}

const repliedProcess = (state: LyricCommentState, item: LyricRepliedCommentResponse): LyricCommentItem | undefined => {
    const comment = state.comments.find(c => c.id === item.commentId);
    if (comment) {
        if (comment.replied.comments) {
            comment.replied.comments = [...item.replies, ...comment.replied.comments];
        } else {
            comment.replied.comments = [...item.replies];
        }
        comment.replied.has_next = (comment.replied.total > 0 ) && (comment.replied.total > comment.replied.comments.length);
        comment.isShowReplies = true;
        comment.offset = !comment.offset ? MAX_REPLY_PER_COMMENT: comment.offset + MAX_REPLY_PER_COMMENT;
    }

    return comment;
}

const lyricInfoSlice = createSlice({
    name: 'lyric/info',
    initialState: initialState,
    reducers: {

        fetchLyricInfo(state, action: PayloadAction<{ref: string, locale: string | undefined}>) {
            state.loading = true;
        },
        fetchLyricInfoSuccess(state, action) {
          const res: LyricDetailResponse = action.payload.data.body;
          state.lyricDetail = res;
          state.comments = res.comment.comments ? res.comment.comments.reverse(): [];
          state.hasMore = res.comment.has_next;
          state.loading = false;
          state.isScrollToBottom = true;
          state.isNotFound = false;
          state.isRated = res.is_rated;
          state.id = state.lyricDetail.id;
          if (state.hasMore) {
              state.offset = MAX_COMMENTS;
          }
        },
        fetchLyricInfoFailed(state, action: PayloadAction<any>) {
            state.loading = false;
            state.isScrollToBottom = true;
            if (action.payload === 404) {
                state.isNotFound = true;
            }
        },
        loadMoreComments(state, action: PayloadAction<{lyricId: number, offset: number, locale: string | undefined}>) {
            state.loading = true;
        },
        loadMoreCommentsSuccess(state, action) {
            state.loading = false;
            const res: LyricLoadMoreResponse = action.payload.data.body;
            if (state.comments) {
                state.comments = [...res.comments, ...state.comments];
            } else {
                state.comments = [...res.comments];
            }
            state.isScrollToBottom = true;
            if (state.lyricDetail && state.lyricDetail.comment && state.hasMore) {
                state.hasMore = state.lyricDetail.comment.total > state.comments.length;
            }
            state.offset = state.offset + MAX_COMMENTS;
        },
        loadMoreCommentsFailed(state) {
            state.loading = false;
        },
        addNewComment(state, action: PayloadAction<{request: LyricAddCommentRequest, locale: string | undefined}>) {
            state.commentBoxLoading = true;
        },
        addNewCommentSuccess(state, action) {
            state.commentBoxLoading = false;
            const res: LyricAddCommentResponse = action.payload.data.body;
            const comment: LyricCommentItem = {...res};
            if (state.comments) {
                state.comments = [...state.comments, ...[comment]];
            } else {
                state.comments = [comment];
            }
            state.scrollPosition = 0;
            state.isScrollToBottom = true;
        },
        addNewCommentFailed(state) {
            state.commentBoxLoading = false;
        },
        triggerReplyBox(state, action: PayloadAction<{lyricId: number, commendId: number, offset: number | undefined, shouldLoad: boolean, locale: string | undefined}>) {
        },
        triggerReplyBoxSuccess(state, action: PayloadAction<{commendId: number, isLoaded: boolean, data: any}>) {
            const {commendId, isLoaded, data} = action.payload;
            if (isLoaded) {
                const item: LyricRepliedCommentResponse = data.data.body;
                repliedProcess(state, item);
            }
            const {replyBoxId, showReplyBox} = state;
            if (replyBoxId === commendId) {
                state.showReplyBox = !showReplyBox;
            } else {
                state.replyBoxId = commendId;
                state.showReplyBox = true;
                state.replyText = '';
            }


        },
        triggerReplyBoxFailed(state) {

        },
        clearReplyBox(state) {
            state.replyBoxId = -1;
            state.showReplyBox = false;
        },
        stopScrollToBottom(state) {
            state.isScrollToBottom = false;
        },
        addNewReplyComment(state, action: PayloadAction<{request: LyricAddReplyRequest, locale: string | undefined}>) {
            state.commentBoxLoading = true;
        },
        addNewReplyCommentSuccess(state, action) {
            state.commentBoxLoading = false;
            const res: LyricAddReplyResponse = action.payload.data.body;
            const reply: LyricCommentBaseItem = {...res};
            const comment = state.comments.find(comment => comment.id === res.comment_id);
            if (comment) {
                if (comment.replied) {
                    comment.replied = {
                        total: comment.replied.total ? comment.replied.total + 1: 1,
                        has_next: comment.replied.has_next,
                        comments: comment.replied.comments ? [...comment.replied.comments, ...[reply]]: [reply]
                    }
                } else {
                    comment.replied = {
                        total: 1,
                        has_next: false,
                        comments: [reply]
                    }
                }
                comment.isShowReplies = true;
            }
        },
        addNewReplyCommentFailed(state) {
            state.commentBoxLoading = false;
        },
        likeComment(state, action: PayloadAction<{request: LyricLikeCommentRequest, locale: string | undefined}>) {

            state.commentBoxLoading = true;
        },
        likeCommentSuccess(state, action) {
            state.commentBoxLoading = false;
            const res: LyricLikeCommentResponse = action.payload.data.body;
            const {comment_id, likes, is_liked} = res;
            const comment = state.comments.find(comment => comment.id === comment_id);
            if (comment) {
                comment.is_liked = is_liked;
                comment.likes = likes;
            }
        },
        likeCommentFailed(state) {
            state.commentBoxLoading = false;
        },
        likeReplyComment(state, action: PayloadAction<{request: LyricLikeReplyRequest, locale: string | undefined}>) {
            state.commentBoxLoading = true;
        },
        likeReplyCommentSuccess(state, action) {
            state.commentBoxLoading = false;
            const res: LyricLikeReplyResponse = action.payload.data.body;
            const {comment_id, likes, is_liked, reply_id} = res;
            const comment = state.comments.find(comment => comment.id === comment_id);
            if (comment && comment.replied) {
                const reply = comment.replied.comments.find(r => r.id === reply_id);
                if (reply) {
                    reply.is_liked = is_liked;
                    reply.likes = likes;
                }
            }
        },
        likeReplyCommentFailed(state) {
            state.commentBoxLoading = false;
        },
        setScrollPosition(state, action: PayloadAction<number>) {
            const position = action.payload;
            state.scrollPosition = position;
        },
        setCommentName(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        showRepliedCommentList(state, action: PayloadAction<{lyricId: number, commendId: number, offset: number | undefined, locale: string | undefined}>) {
        },
        showRepliedCommentListSuccess(state, action) {
            const item: LyricRepliedCommentResponse = action.payload.data.body;
            const comment = repliedProcess(state, item);
            if (comment && state.replyBoxId !== item.commentId && !state.showReplyBox) {
                state.replyBoxId = item.commentId;
                state.showReplyBox = true;
                state.replyText = '';
            }
        },
        showRepliedCommentListFailed(state) {

        },
        changeShowReplies(state, action: PayloadAction<number>) {
            const id = action.payload;
            const comment = state.comments.find(c => c.id === id);
            if (comment) {
                comment.isShowReplies = !comment.isShowReplies;
            }
        },
        seeMoreComments(state, action: PayloadAction<{lyricId: number, commendId: number, offset: number | undefined, locale: string | undefined}>) {
        },
        seeMoreCommentsSuccess(state, action) {
            const item: LyricRepliedCommentResponse = action.payload.data.body;
            repliedProcess(state, item);
        },
        seeMoreCommentsFailed(state) {

        },
        rateLyric(state, action: PayloadAction<{lyricId: number, req: LyricRateRequest, locale: string | undefined}>) {
            state.isRateLoading = true;
        },
        rateLyricSuccess(state, action) {
            state.isRateLoading = false;
            state.isRateSuccess = true;
            state.isRated = true;
            const res: LyricRateResponse = action.payload.data.body;
            if (state.lyricDetail) {
                state.lyricDetail.rate = res.rate;
                // state.lyricDetail.account_info.total_rate
            }

            const comment: LyricCommentItem = {...res.comment};
            if (state.comments) {
                state.comments = [...state.comments, ...[comment]];
            } else {
                state.comments = [comment];
            }
        },
        rateLyricFailed(state) {
            state.isRateLoading = false;
            state.isRateSuccess = false;
        },
        closeIsRateSuccess(state) {
            state.isRateSuccess = false;
        }
    }
});

export const {
    loadMoreComments,
    loadMoreCommentsFailed,
    loadMoreCommentsSuccess,
    addNewComment,
    addNewCommentSuccess,
    addNewCommentFailed,
    triggerReplyBox,
    triggerReplyBoxSuccess,
    triggerReplyBoxFailed,
    clearReplyBox,
    addNewReplyComment,
    addNewReplyCommentSuccess,
    addNewReplyCommentFailed,
    likeComment,
    likeReplyComment,
    likeReplyCommentSuccess,
    likeReplyCommentFailed,
    changeShowReplies,
    stopScrollToBottom,
    setScrollPosition,
    setCommentName,
    showRepliedCommentList,
    showRepliedCommentListSuccess,
    showRepliedCommentListFailed,
    seeMoreComments,
    seeMoreCommentsSuccess,
    seeMoreCommentsFailed,
    fetchLyricInfo,
    fetchLyricInfoSuccess,
    likeCommentSuccess,
    likeCommentFailed,
    fetchLyricInfoFailed,
    rateLyric,
    rateLyricSuccess,
    rateLyricFailed,
    closeIsRateSuccess
} = lyricInfoSlice.actions;

export default lyricInfoSlice.reducer;