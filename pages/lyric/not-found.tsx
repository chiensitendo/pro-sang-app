import {NextPage} from "next";
import withNotification from "../../components/with-notification";
import LyricLayout from "../../layouts/LyricLayout";
import * as React from "react";
import {useRouter} from "next/router";
import LyricNotFound from "../../components/lyric/components/LyricNotFound";

const LyricNotFoundPage: NextPage = () => {
    const {locale} = useRouter();
    return <LyricLayout>
        <LyricNotFound locale={locale}/>
    </LyricLayout>
}

export default withNotification(LyricNotFoundPage);