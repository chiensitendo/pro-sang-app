
export enum LyricStatuses {
    HIDDEN,
    PUBLISH
}

export interface LyricListBaseItem {
    total: number,
    has_next: boolean
}

export interface LyricCommentBaseItem {
    id: number,
    content?: string,
    likes?: number,
    is_liked?: boolean,
    user_info: LyricCommentUserInfo,
    created_date: string,
    updated_date: string
}

export interface LyricCommentItem extends LyricCommentBaseItem {
    stars?: number,
    replied: LyricReplyComment,
    offset?: number, // additional field
    isShowReplies?: boolean // additional field
}

export interface LyricCommentUserInfo {
    id: number,
    name: string,
    username: string,
    email: string,
    photo_url: string
}

export interface LyricAccountInfo extends LyricCommentUserInfo {
    lyric_number: number,
    total_rate: number
}

export interface LyricComment extends LyricListBaseItem {
    comments: Array<LyricCommentItem>
}

export interface LyricReplyComment extends LyricListBaseItem {
    comments: Array<LyricCommentBaseItem>
}

export interface LyricDetailResponse {

    id: number,
    title: string,
    rate?: number,
    status: LyricStatuses,
    comment: LyricComment,
    content?: string,
    description?: string,
    is_deleted: boolean,
    is_rated: boolean,
    created_date: string,
    updated_date: string,
    composers?: string,
    current_owners?: string,
    singers?: string,
    account_info: LyricAccountInfo
}

export interface LyricRepliedCommentResponse {
    commentId: number,
    replies: Array<LyricCommentBaseItem>
}

export interface LyricLikeCommentRequest {
    comment_id: number,
    account_id: number,
    is_liked: boolean
}

export interface LyricLikeCommentResponse {
    comment_id: number,
    account_id: number,
    is_liked: boolean,
    likes: number
}

export interface LyricLikeReplyRequest extends LyricLikeCommentRequest {
    reply_id: number
}

export interface LyricLikeReplyResponse extends LyricLikeCommentResponse {
    reply_id: number
}

export interface LyricAddCommentRequest {
    lyric_id: number,
    content: string,
    account_id: number,
    user_info: LyricCommentUserInfo,
}

export interface LyricAddReplyRequest extends LyricAddCommentRequest {
    comment_id: number,
}

export interface LyricAddCommentResponse extends LyricCommentItem {

}

export interface LyricAddReplyResponse extends LyricCommentBaseItem {
    comment_id: number,
}

export interface LyricLoadMoreResponse {
    comments: Array<LyricCommentItem>;
}

export interface LyricRateRequest {
    stars: number,
    user_info: LyricCommentUserInfo
}

export interface LyricRateResponse {
    rate: number,
    stars: number,
    comment: LyricAddCommentResponse
}

export interface LyricEditDetailResponse {
    id: number,
    title: string,
    rate?: number,
    status: LyricStatuses,
    content?: string,
    description?: string,
    is_deleted: boolean,
    created_date: string,
    updated_date: string,
    composers?: string,
    owners?: string,
    singers?: string,
    account_id: number
}

export interface LyricListItem {
    id: number,
    title: string,
    rate?: number,
    status: LyricStatuses,
    comments: number,
    is_deleted: boolean,
    created_date: string,
    updated_date: string,
    account_info: LyricAccountInfo
}

export interface LyricListResponse {
    total: number;
    items: Array<LyricListItem>;
}