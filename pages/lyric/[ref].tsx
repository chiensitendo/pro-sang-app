import LyricLayout from "../../layouts/LyricLayout";
import {NotificationProps} from "../../types/page";
import withNotification from "../../components/with-notification";
import {useRouter} from "next/router";
import styles from "./styles/detail.module.scss";
import {Alert, Button, Form, Rate} from "antd";
import {EditFilled, LikeOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {
    addNewComment, changeShowReplies,
    clearReplyBox, likeComment, likeReplyComment,
    loadMoreComments,
    addNewReplyComment,
    seeMoreComments,
    setScrollPosition,
    showRepliedCommentList,
    stopScrollToBottom,
    triggerReplyBox, closeIsRateSuccess, rateLyric
} from "../../redux/reducers/lyric/lyricInfoSlice";
import {fetchLyricContent} from "../../redux/reducers/lyric/lyricContentSlice";
import * as React from "react";
import {fetchLyricInfo} from "../../redux/reducers/lyric/lyricInfoSlice";
import LyricCommentListV2 from "../../components/lyric/components/LyricCommentListV2";
import {LoggingUserInfo} from "../../types/account";
import {LyricCommentUserInfo} from "../../types/lyric";
import LyricNotFound from "../../components/lyric/components/LyricNotFound";
import getTranslation from "../../components/translations";
import LyricMainContent from "../../components/lyric/components/LyricMainContent";
import {getUserInfo} from "../../services/auth_services";
import {PrivateTag} from "./list";
import {LyricStatuses} from "../../apis/lyric-apis";
import Head from "next/head";


const toUserInfo = (u: LoggingUserInfo): LyricCommentUserInfo => {

    return {
        ...u, photo_url: u.photoUrl
    }
}


const LyricDetailPage = (props: LyricDetailPageProps) => {
    const {locale, query, push} = useRouter();
    const {onErrors} = props;
    const dispatch = useDispatch();
    const {items} = useSelector((state: RootState) => state.lyricComments);
    const {lyricDetail, showReplyBox, replyBoxId, isScrollToBottom, scrollPosition, isRated, isRateLoading, isRateSuccess, isNotFound} =
        useSelector((state: RootState) => state.lyricInfo);
    const [loggInUserInfo, setLoggInUserInfo] = useState<LoggingUserInfo | null>(null);

    const {ref} = query;
    const [form] = Form.useForm();
    const [rate, setRate] = useState(4.5);

    const handleOnRate = (values: any) => {
        if (isRated || !rate) {
            return;
        }
        loggInUserInfo && lyricDetail && dispatch(rateLyric({
            lyricId: lyricDetail.id,
            req: {
                stars: rate,
                user_info: toUserInfo(loggInUserInfo)
            },
            locale
        }))
    }

    const handleEdit = () => {
        lyricDetail && push("/lyric/edit/" + lyricDetail.id).then();
    }

    useEffect(() => {
        dispatch(fetchLyricContent(ref as string));
        setLoggInUserInfo(getUserInfo());
    },[]);

    useEffect(() => {
        ref && dispatch(fetchLyricInfo({ref: ref as string, locale}));
    },[ref]);

    useEffect(() => {
        isRateSuccess && dispatch(closeIsRateSuccess());
    },[isRateSuccess]);

    return <LyricLayout>
        <Head>
            <title>{getTranslation("lyric.lyric", "Lyric", locale)} - {getTranslation("lyric.slogan", "Save your lyric for free", locale)} | {lyricDetail ? lyricDetail.title: ''}</title>
        </Head>
        {isNotFound && <LyricNotFound locale={locale}/>}
        {lyricDetail && <div className={styles.wrapper}>
            <div className={styles.actions}>
                {lyricDetail.status === LyricStatuses.HIDDEN && <PrivateTag locale={locale}/>}
                {loggInUserInfo && loggInUserInfo.id === lyricDetail.account_info.id &&
                    <Button icon={<EditFilled />} onClick={handleEdit}>{getTranslation("lyric.button.edit", "Edit", locale)}</Button>}
            </div>
            <LyricMainContent lyricDetail={lyricDetail} locale={locale}/>
            <div className={styles.containers}>
                <div className={styles.commentContainer}>
                    {!isRated && loggInUserInfo
                        && loggInUserInfo.id !== lyricDetail.account_info.id
                        && <Form name={"rate"} form={form} className={styles.__form} layout={"vertical"} onFinish={handleOnRate}>
                        <div className={styles.rate}>
                            {<span>RATE THIS LYRIC: </span>}
                            <Rate allowHalf defaultValue={rate} disabled={isRated} onChange={(value: number) => setRate(value)} />
                            {<Button icon={<LikeOutlined />} disabled={isRated} loading={isRateLoading} htmlType="submit">
                                {getTranslation("lyric.detail.rate", "Rate!", locale)}
                            </Button>}
                        </div>
                        {isRateSuccess && <Alert message={getTranslation("lyric.detail.rateDone", "Thank you for your rate!", locale)} type="success" />}
                    </Form>}
                    <div className={styles.comment}>
                        <p className={styles.__title}>{getTranslation("lyric.detail.comment.title", "COMMENTS", locale)}</p>
                        <LyricCommentListV2
                            nameForm={form}
                            data={items}
                            userInfo={loggInUserInfo}
                            showReplyBox={showReplyBox}
                            replyBoxId={replyBoxId}
                            locale={locale}
                            onLoadMore={(id, offset) => dispatch(loadMoreComments({
                                lyricId: id,
                                offset,
                                locale
                            }))}
                            onTriggerReplyBox={(id, offset, shouldLoad) => {
                                dispatch(triggerReplyBox({
                                    lyricId: lyricDetail.id,
                                    commendId: id,
                                    offset,
                                    shouldLoad,
                                    locale
                                }));
                            }
                            }
                            onLikeComment = {request => dispatch(likeComment({request,locale}))}
                            onLikeReply = {request => dispatch(likeReplyComment({request,locale}))}
                            onClearReplyBox={() => dispatch(clearReplyBox())}
                            onErrors={err => onErrors && onErrors(err)}
                            onAddNewComment={(val) => loggInUserInfo && val && dispatch(addNewComment( {
                                request: {
                                            content: val,
                                            user_info: toUserInfo(loggInUserInfo),
                                            account_id: loggInUserInfo.id,
                                            lyric_id: lyricDetail.id
                                            },
                                locale}))}
                            onReplyComment={(val, item) => loggInUserInfo && val && dispatch(addNewReplyComment({
                                request: {
                                    lyric_id: lyricDetail.id,
                                    account_id: loggInUserInfo.id,
                                    comment_id: item.id,
                                    content: val,
                                    user_info: toUserInfo(loggInUserInfo)
                                },
                                locale
                            }))}
                            isScrollToBottom={isScrollToBottom}
                            onScrolledToBottom={() => dispatch(stopScrollToBottom())}
                            scrollPosition={scrollPosition}
                            onScrollPositionChange={pos => dispatch(setScrollPosition(pos))}
                            onShowCommentList={(id, offset, shouldLoad) => {
                                if (shouldLoad) {
                                    dispatch(showRepliedCommentList({
                                        lyricId: lyricDetail.id,
                                        commendId: id,
                                        offset,
                                        locale
                                    }));
                                } else {
                                    dispatch(changeShowReplies(id));
                                }
                            }}
                            onSeeMoreComments={(id, offset) => dispatch(seeMoreComments({
                                lyricId: lyricDetail.id,
                                commendId: id,
                                offset,
                                locale
                            }))}
                        />
                    </div>
                </div>
                {/*<div className={styles.relatesContainer}>*/}
                {/*    CCC*/}
                {/*</div>*/}
            </div>
        </div>}
    </LyricLayout>
}

interface LyricDetailPageProps extends NotificationProps {
    children?: any;
}

export default withNotification(LyricDetailPage);