// import LyricPageHeader from "../components/lyric/components/layout/LyricPageHeader";
// import LyricBreadcrumb from "../components/lyric/components/layout/LyricBreadcrumb";
import {useRouter} from "next/router";




const LyricLayout = (props: LyricLayoutProps) => {
    const {children} = props;
    const {pathname, locale, query} = useRouter();
    return <div>
        {/* <LyricPageHeader/>
        <LyricBreadcrumb pathname={pathname} query={query} locale={locale}/> */}
        {children}
    </div>
}

interface LyricLayoutProps {
    children?: any;
}

export default LyricLayout;