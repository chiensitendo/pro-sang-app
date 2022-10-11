import React from "react";
import styles from "../../../pages/lyric/styles/components/LyricNotFound.module.scss";
import getTranslation from "../../translations";

const LyricNotFound: React.FC<LyricNotFoundProps> = (props) => {
    const {locale} = props;
    return <div className={styles.wrapper}>
        <div className={styles.image}>
            <img src="/images/not-found.svg"/>
        </div>
        <h1>{getTranslation("lyric.detail.notFound.title","Lyric Not Found", locale)}</h1>
        <p>{getTranslation("lyric.detail.notFound.text", "Sorry! We couldn't find this lyric.", locale)}</p>
    </div>
}

interface LyricNotFoundProps {
    children?: any;
    locale: string | undefined;
}

export default LyricNotFound;