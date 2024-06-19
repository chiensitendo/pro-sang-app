"use client";

import ProHeader from "@/components/core/header/ProHeader";
import Banner from "@/components/banner";
import BlogLogo from "../core/logo/BlogLogo";
import styles from  "./blog-layout.module.scss";

const BlogLayout = ({children}: {children: React.ReactNode}) => {

    return <div className={styles.BlogLayout}>
        <ProHeader logo={<BlogLogo/>}/>
        <Banner/>
        {children}
    </div>
}

export default BlogLayout;