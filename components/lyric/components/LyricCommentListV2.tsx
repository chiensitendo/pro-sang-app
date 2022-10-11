import {Avatar, Button, Comment, Divider, Form, List, Rate, Skeleton, Spin, Tooltip} from 'antd';
import React, {
    createElement,
    LegacyRef, useCallback,
    useEffect, useMemo,
    useRef, useState,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {LikeFilled, LikeOutlined, SearchOutlined, SendOutlined} from "@ant-design/icons";
import styles from "../../../pages/lyric/styles/LyricCommentList.module.scss";
import classNames from "classnames";
import {FormInstance} from "antd/lib/form/hooks/useForm";
import {Values} from "async-validator";
import {CommentType} from "../../../redux/reducers/lyric/lyricCommentSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store";
import {
    LyricCommentBaseItem,
    LyricCommentItem,
    LyricLikeCommentRequest,
    LyricLikeReplyRequest
} from "../../../types/lyric";
import {LoggingUserInfo} from "../../../types/account";
import {convertFromJSONStringToHTML} from "../../../utils/TextEditorConvert";
import ChatTextEditor from "../../core/ChatTextEditor";
import {getFullDatetimeString} from "../../../utils/utils";
import getTranslation from "../../translations";

const action = 'liked';


const COMMENTS_WINDOW_HEIGHT = 400;

const MAXIMUM_COMMENT_CHAR_COUNT = 200;

const MINIMUM_COMMENT_CHAR_COUNT = 6;

const MAXIMUM_COMMENT_LINE_COUNT = 30;


const LyricComment: React.FC<CommentProps> = (props: CommentProps) => {
    const {item, onReply, className, onShowComments, isLogging, onLike, onNotification, locale} = props;
    const actions = useMemo(() => {
        let basicActions = [
            <Tooltip key="comment-basic-like"
                     title={getTranslation( `lyric.detail.comment.${item.is_liked ? 'unlike': 'like'}`,
                         item.is_liked ? 'Unlike': 'Like', locale)}>
              <span className={classNames({"liked_span": item.is_liked})} onClick={() => {
                  if (isLogging) {
                      onLike && onLike({
                          comment_id: item.id,
                          account_id: item.user_info.id,
                          is_liked: !(!item.is_liked? false : true)
                      });
                  } else {
                      onNotification &&
                      onNotification(getTranslation( "lyric.notification.mustLoginToUse", "You must log in to use this feature!", locale));
                  }
              }}>
                {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
                  <span className="comment-action"> {item.likes}</span>
              </span>
                    </Tooltip>,
                    <span onClick={onShowComments}>
                    {`${getTranslation( "lyric.detail.comment.replies", "Replies", locale)}(${item.replied ? item.replied.total : 0})`}
                </span>,
        ];
        if (isLogging) {
            basicActions.push(<span key="comment-basic-reply-to" onClick={() => {
                onReply && onReply(item.id);
            }}>{getTranslation( "lyric.detail.comment.replyTo", "Reply To", locale)}</span>);
        }
        return basicActions;
    }, [isLogging, item]);

    const renderedContent = useMemo(() => {
        if (!item.content) {
            return '';
        }
        try {
            return convertFromJSONStringToHTML(item.content);
        } catch (e) {
            return '';
        }
    },[item]);

    return <Comment
        className={className}
        actions={(item.stars) ? []: actions}
        author={<a><p style={{fontSize: 14}}>{item.user_info?.name ? item.user_info?.name: item.user_info?.username}</p></a>}
        avatar={<Avatar src={item.user_info?.photo_url} alt={item.user_info?.username} />}
        datetime={<div><span>{getFullDatetimeString(item.created_date)}</span></div>}
        content={
            item.stars ? <Rate allowHalf disabled defaultValue={item.stars} />:
                <div className={styles.commentContent} dangerouslySetInnerHTML={{__html: renderedContent}}></div>
        }
        >
        {props.children}
    </Comment>;
}

interface CommentProps {
    item: LyricCommentItem;
    children?: React.ReactNode;
    onReply?: (id: number) => void;
    onLike?: (req: LyricLikeCommentRequest) => void;
    className?: string;
    onShowComments?: () => void;
    isLogging?: boolean;
    onNotification?: (message: string) => void;
    locale?: string | undefined;
}

const LyricReply: React.FC<ReplyProps> = (props: ReplyProps) => {
    const {reply, className, onChildReply, isLogging, onLike, onNotification, commentId, locale} = props;
    const actions =  [
        <Tooltip key="comment-basic-like" title={getTranslation( `lyric.detail.comment.${reply.is_liked ? 'unlike': 'like'}`,
            reply.is_liked ? 'Unlike': 'Like', locale)}>
      <span className={classNames({"liked_span": reply.is_liked})} onClick={() => {
          if (isLogging) {
              onLike && onLike({
                  comment_id: commentId,
                  reply_id: reply.id,
                  is_liked: !(!reply.is_liked? false : true),
                  account_id: reply.user_info.id
              });
          } else {
              onNotification &&
              onNotification(getTranslation( "lyric.notification.mustLoginToUse", "You must log in to use this feature!", locale));
          }
      }}>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span className="comment-action"> {reply.likes}</span>
      </span>
        </Tooltip>,
        <span key="comment-basic-reply-to" onClick={() => {
            onChildReply && onChildReply();
        }}>{getTranslation( "lyric.detail.comment.replyTo", "Reply To", locale)}</span>,
    ];

    const renderedContent = useMemo(() => {
        if (!reply.content) {
            return '';
        }
        try {
            return convertFromJSONStringToHTML(reply.content);
        } catch (e) {
            return '';
        }
    },[reply]);

    return <Comment
        className={className}
        actions={actions}
        author={<a>{reply.user_info?.name ? reply.user_info?.name: reply.user_info?.username}</a>}
        avatar={<Avatar src={reply.user_info?.photo_url} alt={reply.user_info?.username} />}
        datetime={<div><span>{getFullDatetimeString(reply.created_date)}</span></div>}
        content={
            <div className={styles.commentContent} dangerouslySetInnerHTML={{__html: renderedContent}}></div>
        }
    >
        {props.children}
    </Comment>;
}

interface ReplyProps {
    commentId: number;
    reply: LyricCommentBaseItem;
    children?: React.ReactNode;
    onChildReply?: () => void;
    className?: string;
    onLike?: (req: LyricLikeReplyRequest) => void;
    isLogging?: boolean;
    onNotification?: (message: string) => void;
    locale?: string | undefined;
}

const LyricCommentListV2: React.FC<LyricCommentListProps> = (props: LyricCommentListProps) => {
    const {
        onLoadMore,
        userInfo,
        onAddNewComment,
        onTriggerReplyBox,
        showReplyBox, replyBoxId,
        onClearReplyBox,
        onReplyComment,
        isScrollToBottom,
        onScrolledToBottom,
        scrollPosition,
        onScrollPositionChange,
        onShowCommentList,
        onSeeMoreComments,
        onLikeComment,
        onLikeReply,
        onErrors,
        locale} = props;
    const [form] = Form.useForm();
    const {hasMore, comments, commentBoxLoading, id, offset} = useSelector((state: RootState) => state.lyricInfo);
    const [newCommentForm] = Form.useForm();
    const infinityRef: LegacyRef<InfiniteScroll> = useRef(null);
    const replyBoxRef: React.Ref<FormInstance<Values>> | undefined = useRef(null);
    const replyCommentRef: LegacyRef<HTMLDivElement> = useRef(null);
    const [replyState, setReplyState] = useState('');
    const [replyCharCount, setReplyCharCount] = useState(0);
    const [replyLineCount, setReplyLineCount] = useState(0);
    const [commentState, setCommentState] = useState('');
    const [commentCharCount, setCommentCharCount] = useState(0);
    const [commentLineCount, setCommentLineCount] = useState(0);
    const [isReplyClear, setIsReplyClear] = useState<boolean>(false);
    const [isCommentClear, setIsCommentClear] = useState<boolean>(false);
    const scrollToBottom = (pos: number) => {
        const scrollableDivEle = document.getElementById("scrollableDiv");
        if (scrollableDivEle) {
            scrollableDivEle.scrollTo({
                top: -1 * pos,
                left: 0
            })
        }
    }

    const clearReplyBox = () => {
        onClearReplyBox();
        form.setFieldsValue({reply: ''});
    }

    const handleOnSubmit = (values: any, item: LyricCommentItem) => {
        if (!replyState || !replyCharCount || replyCharCount > MAXIMUM_COMMENT_CHAR_COUNT
            || replyCharCount < MINIMUM_COMMENT_CHAR_COUNT
            || replyLineCount > MAXIMUM_COMMENT_LINE_COUNT) {
            return;
        }
        onReplyComment(replyState, item);
        setReplyState('');
        setIsReplyClear(true);
        setReplyLineCount(0);
        setReplyCharCount(0);
        setTimeout(() => {
           if (replyCommentRef && replyCommentRef.current) {
               replyCommentRef.current.scrollIntoView({
                   block: "center"
               });
           }
        });
    }

    const handleOnSubmitNewComment = (values: any) => {
        if (!commentState || !commentCharCount
            || commentCharCount > MAXIMUM_COMMENT_CHAR_COUNT || commentCharCount < MINIMUM_COMMENT_CHAR_COUNT || commentLineCount > MAXIMUM_COMMENT_LINE_COUNT) {
            return;
        }
        onAddNewComment(commentState);
        scrollToBottom(0);
        setCommentState("");
        setCommentCharCount(0);
        setCommentLineCount(0);
        setIsCommentClear(true);
    }

    const onNextScroll = useCallback(() => {
        if (infinityRef.current && infinityRef.current.getScrollableTarget() != null) {
            const scrollableTarget = infinityRef.current.getScrollableTarget();
            if (scrollableTarget) {
                const scrollHeight = scrollableTarget.scrollHeight;
                if (scrollHeight <= COMMENTS_WINDOW_HEIGHT) {
                    onScrollPositionChange(scrollHeight);
                } else {
                    onScrollPositionChange(scrollHeight - COMMENTS_WINDOW_HEIGHT);
                }

            } else {
                onScrollPositionChange(0);
            }
        }
        id && offset > 0 && onLoadMore(id, offset);
    },[infinityRef.current, onScrollPositionChange, id, offset]);

    useEffect(() => {
        if (isScrollToBottom) {
            scrollToBottom(scrollPosition);
            onScrolledToBottom();
        }
    },[isScrollToBottom, scrollPosition]);


    useEffect(() => {
        replyCommentRef.current && showReplyBox && replyCommentRef.current.scrollIntoView({
            behavior: "smooth",
        });

    },[replyCommentRef, showReplyBox]);

    return (
        <React.Fragment>
            <Spin spinning={commentBoxLoading}>
        <div
            className={styles.scrollContainer}
            id="scrollableDiv"
            style={{height: comments.length > 0 ? COMMENTS_WINDOW_HEIGHT: 'auto'}}
        >
            <InfiniteScroll
                dataLength={comments.length}
                next={onNextScroll}
                hasMore={hasMore}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={comments.length > 0 && <Divider plain>{getTranslation("lyric.detail.comment.endMessage", "It is all, nothing more ", locale)} 🤐</Divider>}
                scrollableTarget="scrollableDiv"
                inverse={true}
                ref={infinityRef}
                style={{ display: "flex", flexDirection: "column-reverse" }}
            >
                <List
                    dataSource={comments}
                    renderItem={item => (
                        <React.Fragment>
                            <LyricComment className={classNames({[styles.activeComment]: showReplyBox && (replyBoxId === item.id)}, styles.lyricComment)} key={item.id} item={item}
                                          onReply={id => onTriggerReplyBox(id, item.offset, !item.isShowReplies && (item.replied.total > 0 && (!item.replied.comments || item.replied.comments.length === 0)))}
                                          onShowComments={() => item.id && item.replied.total > 0 && onShowCommentList(item.id, item.offset, !item.isShowReplies && (!item.replied.comments))}
                                          onLike={onLikeComment}
                                          onNotification={mes => onErrors && onErrors(mes)}
                                          locale={locale}
                                          isLogging={userInfo !== undefined && userInfo !== null}>
                                {item.isShowReplies && item.replied.has_next &&
                                    <span className={styles.showMoreText} onClick={() => item.id && onSeeMoreComments(item.id, item.offset)}>Show more comments</span>}
                                {item.isShowReplies && item.replied.comments && item.replied.comments.map(reply => {
                                    return <LyricReply commentId={item.id} reply={reply} isLogging={userInfo !== undefined && userInfo !== null}
                                                       onNotification={mes => onErrors && onErrors(mes)}
                                                       locale={locale}
                                                       key={reply.id} onChildReply={() => item.id && onTriggerReplyBox(item.id, item.offset, false)}
                                                        onLike={onLikeReply}/>
                                })}
                            </LyricComment>
                            {showReplyBox && (replyBoxId === item.id) && userInfo && <div ref={replyCommentRef}>
                                <Comment
                                    avatar={<Avatar src={userInfo.photoUrl} alt={userInfo.name} />}
                                    content={<Form
                                        form={form}
                                        ref={replyBoxRef}
                                        name={`${item.id} + "-" + ${item.user_info?.username}`}
                                        onFinish={values => handleOnSubmit(values, item)}
                                        autoComplete="off"
                                        className={styles.replyBox}>
                                        <ChatTextEditor charLimit={MAXIMUM_COMMENT_CHAR_COUNT}
                                                        minChar={MINIMUM_COMMENT_CHAR_COUNT}
                                                        lineLimit={MAXIMUM_COMMENT_LINE_COUNT}
                                                        onTextChange={(value, count, line) => {
                                            setReplyState(value);
                                            setReplyCharCount(count ? count: 0);
                                            setReplyLineCount(line ? line: 0);
                                        }} isClear={isReplyClear} onAfterClear={() => setIsReplyClear(false)} height={"small"}/>
                                        <Button className={styles.commentButton} loading={commentBoxLoading} htmlType={"submit"} icon={<SendOutlined />} >
                                            {getTranslation( "lyric.detail.comment.sendButton", "Send", locale)}
                                        </Button>
                                    </Form>}/>
                            </div>}
                        </React.Fragment>

                    )}
                />
            </InfiniteScroll>
        </div>
            </Spin>
            {userInfo && <Comment
                avatar={<Avatar src={userInfo.photoUrl} alt={userInfo.name} />}
                content={<Form
                    form={newCommentForm}
                    name={`new-comment-form`}
                    onFinish={values => handleOnSubmitNewComment(values)}
                    autoComplete="off"
                    onFocus={e => clearReplyBox()}
                    className={styles.replyBox}>
                    <ChatTextEditor charLimit={MAXIMUM_COMMENT_CHAR_COUNT}
                                    minChar={MINIMUM_COMMENT_CHAR_COUNT}
                                    lineLimit={MAXIMUM_COMMENT_LINE_COUNT}
                                    onTextChange={(value, count, line) => {
                        setCommentState(value);
                        setCommentCharCount(count ? count: 0);
                        setCommentLineCount(line ? line: 0);

                    }} isClear={isCommentClear} onAfterClear={() => setIsCommentClear(false)} height={"medium"}/>
                    <Button loading={commentBoxLoading} className={styles.commentButton} htmlType={"submit"} icon={<SendOutlined />} >
                        {getTranslation( "lyric.detail.comment.sendButton", "Send", locale)}
                    </Button>
                </Form>}/>}
        </React.Fragment>
    );
};

interface LyricCommentListProps {
    children?: any;
    nameForm: FormInstance;
    data: CommentType[];
    onLoadMore: (id: number, offset: number) => void;
    onAddNewComment: (val: any) => void;
    onLikeComment: (req: LyricLikeCommentRequest) => void;
    onLikeReply: (req: LyricLikeReplyRequest) => void;
    onTriggerReplyBox: (id: number, offset: number | undefined, shouldLoad: boolean) => void;
    showReplyBox: boolean;
    replyBoxId: number;
    onClearReplyBox: () => void;
    onReplyComment: (val: any, item: LyricCommentItem) => void;
    isScrollToBottom: boolean;
    onScrolledToBottom: () => void;
    scrollPosition: number;
    onScrollPositionChange: (pos: number) => void;
    onShowCommentList: (id: number, offset: number | undefined, shouldLoad: boolean) => void;
    onSeeMoreComments: (id: number, offset: number | undefined) => void;
    userInfo: LoggingUserInfo | undefined | null;
    onErrors?: (err: any) => void;
    locale?: string | undefined;
}

export default LyricCommentListV2;