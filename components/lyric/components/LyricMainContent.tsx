import React, {useMemo} from "react";
import {LyricDetailResponse} from "../../../types/lyric";
import styles from "../../../pages/lyric/styles/detail.module.scss";
import {Avatar, Divider, Rate} from "antd";
import getTranslation from "../../translations";
import {convertFromJSONStringToHTML} from "../../../utils/TextEditorConvert";

const LyricMainContent: React.FC<LyricMainContentProps> = (props) => {

    const {lyricDetail, locale} = props;

    const renderedContent = useMemo(() => {
        if (!lyricDetail || !lyricDetail.content) {
            return '';
        }
        try {
            return convertFromJSONStringToHTML(lyricDetail.content);
        } catch (e) {
            return '';
        }
    },[lyricDetail]);

    const renderedDescription = useMemo(() => {
        if (!lyricDetail || !lyricDetail.description) {
            return '';
        }
        try {
            return convertFromJSONStringToHTML(lyricDetail.description);
        } catch (e) {
            return '';
        }
    },[lyricDetail]);

    return <React.Fragment>
        <div className={styles.header}>
            <h1>{lyricDetail.title}</h1>
            {lyricDetail.rate && <div><Rate allowHalf disabled defaultValue={lyricDetail.rate} /></div>}
        </div>
        <div className={styles.userInfoCard}>
            <Avatar size={"large"} icon={<img src={lyricDetail.account_info.photo_url} alt={'AVT'}/>}/>
            <div>
                <p>{lyricDetail.account_info?.name}</p>
                <div>Lyrics: {lyricDetail?.account_info.lyric_number}</div>
            </div>
        </div>
        <div className={styles.lyricInfo}>
            <p><b>{getTranslation("lyric.detail.composers", "Composers", locale)}:</b> {lyricDetail.composers}</p>
            <p><b>{getTranslation("lyric.detail.singers", "Singers", locale)}:</b> {lyricDetail.singers}</p>
            <p><b>{getTranslation("lyric.detail.owners", "Current Owners", locale)}:</b> {lyricDetail.current_owners}</p>
        </div>
        <Divider orientation="center" orientationMargin="0">
            <p className={styles.divider_text}>{getTranslation("lyric.detail.content", "CONTENT", locale)}</p></Divider>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: renderedContent}}>

        </div>
        <Divider orientation="center" orientationMargin="0">
            <p className={styles.divider_text}>{getTranslation("lyric.detail.description", "CẢM NGHĨ CỦA NGƯỜI VIẾT", locale)}</p></Divider>
        <div className={styles.content} dangerouslySetInnerHTML={{__html: renderedDescription}}>
        </div>
        <Divider/>
    </React.Fragment>
}

interface LyricMainContentProps {
    children?: any;
    lyricDetail: LyricDetailResponse;
    locale?: string | undefined;
}

export default LyricMainContent;