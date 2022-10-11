import React, {useMemo} from "react";
import styles from "../../../pages/lyric/styles/detail.module.scss";
import {LyricDetailResponse} from "../../../types/lyric";
import LyricMainContent from "./LyricMainContent";

const LyricPreview: React.FC<LyricPreviewProps> = (props: LyricPreviewProps) => {

    const {lyricDetail, locale} = props;

    return lyricDetail && <div className={styles.wrapper}>
            <LyricMainContent lyricDetail={lyricDetail} locale={locale}/>
        </div>

}

interface LyricPreviewProps {
    children?: any;
    lyricDetail: LyricDetailResponse | null;
    locale?: string | undefined;
}


export default LyricPreview;