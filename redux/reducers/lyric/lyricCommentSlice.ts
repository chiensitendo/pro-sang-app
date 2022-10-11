import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {transferCommentData} from "../../ultilities";

const MAX_COMMENTS = 5;


export interface CommentDataType {
    gender: string;
    name: {
        title: string;
        first: string;
        last: string;
    };
    email: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    nat: string;
}

export interface CommentUserInfoType {
    id?: number;
    username: string;
    email: string;
    avatar: string;
}

export interface CommentType {
    id?: number;
    content: string;
    likes?: number;
    isShowComments: boolean;
    isAnonymous: boolean;
    createdDate: Date;
    updatedDate: Date;
    account: CommentUserInfoType;
    comments?: CommentType[];
    showComments: CommentType[];
    showCommentIndex: number | null;
}
interface LyricCommentState {
    items: CommentType[],
    loading: boolean,
    showReplyBox: boolean,
    replyBoxId: number,
    name: string,
    replyText: string,
    isScrollToBottom: boolean,
    scrollPosition: number,
    isFlashCommentBox: boolean
}

const initialState: LyricCommentState = {
    items: [],
    loading: false,
    replyBoxId: -1,
    name: "",
    showReplyBox: false,
    replyText: "",
    isScrollToBottom: false,
    scrollPosition: 0,
    isFlashCommentBox: false
}

const lyricCommentsSlice = createSlice({
    name: 'lyric/comments',
    initialState: initialState,
    reducers: {
        fetchCommentList(state) {
            state.loading = true;
        },
        fetchCommentListSuccess(state,action) {
            state.items = transferCommentData(0, action.payload.results);
            state.loading = false;
            state.isScrollToBottom = true;
        },
        fetchCommentListFailed(state) {
            state.loading = false;
            state.isScrollToBottom = true;
        },
        loadMoreComments(state) {
            state.loading = true;
        },
        loadMoreCommentsSuccess(state, action) {
            state.loading = false;
            state.items = [...transferCommentData(state.items.length, action.payload.results),...state.items];
            state.isScrollToBottom = true;
        },
        loadMoreCommentsFail(state) {
            state.loading = false;
        },
        addNewComment(state, action) {
            const content = action.payload;
            const comment = {
                id: state.items.length + 1,
                createdDate: new Date(),
                updatedDate: new Date(),
                account: {
                    id: 11111111111,
                    username: state.name,
                    avatar: "https://joeschmoe.io/api/v1/random",
                    email: ""
                },
                content: content,
                isAnonymous: true,
                likes: 0,
                isShowComments: false,
                showComments: [],
                showCommentIndex: null,
                comments: []
            } as CommentType;
            state.items = [...state.items,...[comment]];
            state.isScrollToBottom = true;
        },
        triggerReplyBox(state, action: PayloadAction<number>) {
            const id = action.payload;
            const {replyBoxId, showReplyBox} = state;
            if (replyBoxId === id) {
                state.showReplyBox = !showReplyBox;
            } else {
                state.replyBoxId = id;
                state.showReplyBox = true;
                state.replyText = '';
            }
            state.items.forEach(item => {
                if (item.id === state.replyBoxId && state.showReplyBox && !item.isShowComments) {
                    item.isShowComments = true;
                }
            });


        },
        clearReplyBox(state) {
            state.replyBoxId = -1;
            state.showReplyBox = false;
        },
        stopScrollToBottom(state) {
            state.isScrollToBottom = false;
        },
        replyComment(state, action: PayloadAction<{ content: any, item: CommentType}>) {
            const payload = action.payload;
            const comment = {
                createdDate: new Date(),
                updatedDate: new Date(),
                account: {
                    id: 11111111111,
                    username: state.name,
                    avatar: "https://joeschmoe.io/api/v1/random",
                    email: ""
                },
                content: payload.content,
                isAnonymous: true,
                likes: 0,
                isShowComments: false
            } as CommentType;
            const modifiedItems = state.items;
            modifiedItems.forEach(i => {
                if (i.id === payload.item.id) {
                    if (!i.comments) {
                        i.comments = [comment];
                        i.showComments = [comment];
                        i.showCommentIndex = 0;
                    } else {
                        i.comments.push(comment);
                        i.showComments.push(comment);
                    }
                    i.isShowComments = true;
                }
            });
            state.items = [...modifiedItems];
        },
        setScrollPosition(state, action: PayloadAction<number>) {
            const position = action.payload;
            state.scrollPosition = position;
        },
        setCommentName(state, action: PayloadAction<string>) {
            state.name = action.payload;
        },
        showCommentList(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.items.forEach(item => {
               if (item.id === id) {
                   item.isShowComments = !item.isShowComments;
                   if (state.replyBoxId && state.showReplyBox) {
                       state.replyBoxId = -1;
                       state.showReplyBox = false;
                       state.replyText = '';
                   }
               }
            });
        },
        seeMoreComments(state, action: PayloadAction<number>) {
            const id = action.payload;
            state.items.forEach(item => {
                if (item.id === id) {
                    if (item.comments && item.showCommentIndex) {
                        if ((item.comments.length - item.showComments.length) > MAX_COMMENTS) {
                            const showComments = item.comments.slice(item.showCommentIndex - MAX_COMMENTS, item.showCommentIndex);
                            item.showComments = [...showComments, ...item.showComments];
                            item.showCommentIndex = item.showCommentIndex - MAX_COMMENTS;
                        } else {
                            const showComments = item.comments.slice(0, item.showCommentIndex);
                            item.showComments = [...showComments, ...item.showComments];
                            item.showCommentIndex = 0;
                        }

                    }
                }
            });
        }
    }
});

export const {
    fetchCommentList,
    fetchCommentListSuccess,
    fetchCommentListFailed,
    loadMoreComments,
    loadMoreCommentsFail,
    loadMoreCommentsSuccess,
    addNewComment,
    triggerReplyBox,
    clearReplyBox,
    replyComment,
    stopScrollToBottom,
    setScrollPosition,
    setCommentName,
    showCommentList,
    seeMoreComments} = lyricCommentsSlice.actions;

export default lyricCommentsSlice.reducer;