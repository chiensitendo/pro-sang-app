import {Avatar, Button, Comment, Divider, Form, List, Skeleton, Tooltip} from 'antd';
import React, {
    createElement,
    LegacyRef, useCallback,
    useEffect,
    useRef,
} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {LikeFilled, LikeOutlined, SearchOutlined, SendOutlined} from "@ant-design/icons";
import styles from "../../../pages/lyric/styles/LyricCommentList.module.scss";
import LyricTextArea from "./LyricTextArea";
import classNames from "classnames";
import {FormInstance} from "antd/lib/form/hooks/useForm";
import {Values} from "async-validator";
import {CommentType} from "../../../redux/reducers/lyric/lyricCommentSlice";

const action = 'liked';


const COMMENTS_WINDOW_HEIGHT = 400;


const LyricComment: React.FC<CommentProps> = (props: CommentProps) => {
    const {item, onReply, className, onChildReply, isChild, onShowComments} = props;
    const actions =  [
        <Tooltip key="comment-basic-like" title="Like">
      <span>
        {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span className="comment-action"> {item.likes}</span>
      </span>
        </Tooltip>,
        <span onClick={onShowComments}>
            {!isChild && `Comments (${item.comments ? item.comments.length : 0})`}
        </span>,
        <span key="comment-basic-reply-to" onClick={() => {
            if (isChild) {
                onChildReply && onChildReply();
            }
            if (item.id) {
                onReply && onReply(item.id);
            }
        }}>Reply to</span>,
    ];

    return <Comment
        className={className}
        actions={actions}
        author={<a>{item.account.username}</a>}
        avatar={<Avatar src={item.account.avatar} alt={item.account.username} />}
        content={
            <p className={styles.commentContent}>
                {item.content}
            </p>
        }
        >
        {props.children}
    </Comment>;
}

interface CommentProps {
    item: CommentType;
    children?: React.ReactNode;
    isChild: boolean;
    onReply?: (id: number) => void;
    onChildReply?: () => void;
    className?: string;
    onShowComments?: () => void;
}

const LyricCommentList: React.FC<LyricCommentListProps> = (props: LyricCommentListProps) => {
    const {
        nameForm,
        name,
        onLoadMore,
        data,
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
        onSeeMoreComments} = props;
    const [form] = Form.useForm();
    const [newCommentForm] = Form.useForm();
    const infinityRef: LegacyRef<InfiniteScroll> = useRef(null);
    const replyBoxRef: React.Ref<FormInstance<Values>> | undefined = useRef(null);
    const replyCommentRef: LegacyRef<HTMLDivElement> = useRef(null);
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

    const handleOnSubmit = (values: any, item: CommentType) => {
        if (!values.reply) {
            return;
        }
        if (!name) {
            nameForm.validateFields(['name']).then(_ => {});;
            return;
        }
        onReplyComment(values.reply, item);
        form.setFieldsValue({reply: ''});
    }

    const handleOnSubmitNewComment = (values: any) => {
        if (!values.content) {
            return;
        }
        if (!name) {
            nameForm.validateFields(['name']).then(_ => {});
            return;
        }
        onAddNewComment(values.content);
        scrollToBottom(0);
        newCommentForm.setFieldsValue({content: ''});
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
        onLoadMore();
    },[infinityRef.current, onScrollPositionChange]);

    useEffect(() => {
        if (isScrollToBottom) {
            scrollToBottom(scrollPosition);
            onScrolledToBottom();
        }
    },[isScrollToBottom, scrollPosition]);


    useEffect(() => {
        replyCommentRef.current && showReplyBox && replyCommentRef.current.scrollIntoView({
            behavior: "smooth"
        });
    },[replyCommentRef, showReplyBox]);

    return (
        <React.Fragment>
        <div
            className={styles.scrollContainer}
            id="scrollableDiv"
            style={{height: COMMENTS_WINDOW_HEIGHT}}
        >
            <InfiniteScroll
                dataLength={data.length}
                next={onNextScroll}
                hasMore={data.length < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
                inverse={true}
                ref={infinityRef}
                style={{ display: "flex", flexDirection: "column-reverse" }}
            >
                <List
                    dataSource={data}
                    renderItem={item => (
                        <React.Fragment>
                            <LyricComment className={classNames({[styles.activeComment]: showReplyBox && (replyBoxId === item.id)})} key={item.id} item={item} isChild={false}
                                            onReply={onTriggerReplyBox} onShowComments={() => item.id && onShowCommentList(item.id)}>
                                {item.isShowComments && item.comments && (item.comments.length - item.showComments.length) > 0 &&
                                    <span className={styles.showMoreText} onClick={() => item.id && onSeeMoreComments(item.id)}>Show more comments</span>}
                                {item.isShowComments && item.showComments && item.showComments.map((child, index) =>
                                    <LyricComment item={child} key={index} isChild={true}
                                                    onChildReply={() => item.id && onTriggerReplyBox(item.id)}>
                                    </LyricComment>)}
                            </LyricComment>
                            {showReplyBox && (replyBoxId === item.id) && <div ref={replyCommentRef}>
                                <Comment
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                                    content={<Form
                                        form={form}
                                        ref={replyBoxRef}
                                        name={`${item.id} + "-" + ${item.account.username}`}
                                        onFinish={values => handleOnSubmit(values, item)}
                                        autoComplete="off"
                                        className={styles.replyBox}>
                                        <LyricTextArea name="reply" rows={5}/>
                                        <Button htmlType={"submit"} icon={<SendOutlined />} >
                                            Send
                                        </Button>
                                    </Form>}/>
                            </div>}
                        </React.Fragment>

                    )}
                />
            </InfiniteScroll>
        </div>
            <Comment
                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                content={<Form
                    form={newCommentForm}
                    name={`new-comment-form`}
                    onFinish={values => handleOnSubmitNewComment(values)}
                    autoComplete="off"
                    onFocus={e => clearReplyBox()}
                    className={styles.replyBox}>
                    <LyricTextArea name="content" rows={5}/>
                    <Button htmlType={"submit"} icon={<SendOutlined />} >
                        Send
                    </Button>
                </Form>}/>
        </React.Fragment>
    );
};

interface LyricCommentListProps {
    children?: any;
    name: string;
    nameForm: FormInstance;
    data: CommentType[];
    onLoadMore: () => void;
    onAddNewComment: (val: any) => void;
    onTriggerReplyBox: (id: number) => void;
    showReplyBox: boolean;
    replyBoxId: number;
    onClearReplyBox: () => void;
    onReplyComment: (val: any, item: CommentType) => void;
    isScrollToBottom: boolean;
    onScrolledToBottom: () => void;
    scrollPosition: number;
    onScrollPositionChange: (pos: number) => void;
    onShowCommentList: (id: number) => void;
    onSeeMoreComments: (id: number) => void;
}

export default LyricCommentList;