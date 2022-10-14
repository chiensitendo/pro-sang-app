import {NextPage} from "next";
import withNotification from "../../components/with-notification";
import LyricLayout from "../../layouts/LyricLayout";
import * as React from "react";
import {useRouter} from "next/router";
import LyricNotFound from "../../components/lyric/components/LyricNotFound";
import Head from "next/head";
import getTranslation from "../../components/translations";

const LyricNotFoundPage: NextPage = () => {
    const {locale} = useRouter();
    return <LyricLayout>
        <Head>
            <title>{getTranslation("lyric.lyric", "Lyric", locale)} - {getTranslation("lyric.slogan", "Save your lyric for free", locale)} | {getTranslation("lyric.detail.notFound.title","Lyric Not Found", locale)}</title>
        </Head>
        <LyricNotFound locale={locale}/>
    </LyricLayout>
}

export default withNotification(LyricNotFoundPage);