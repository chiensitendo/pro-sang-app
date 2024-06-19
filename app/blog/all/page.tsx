"use client";

import BlogLayout from "@/components/blog/blog-layout";
import styles from "../index.module.scss";
import BlogBanner from "@/components/blog/blog-banner";
import BlogItem from "@/components/blog/blog-item";
import { Button } from "antd";
import withNotification from "@/components/with-notification";

const AllBlogPage = () => {

    return (
        <BlogLayout>
          <div className={styles.BlogPage}>
            <BlogBanner isHomePage ={false}/>
            <div className={styles.blog_container}>
                <BlogItem/>
                <BlogItem/>
                <BlogItem/>
                <BlogItem/>
                <BlogItem/>
                <BlogItem/>
            </div>
            <div className={styles.action_btn}>
              <Button>Load More</Button>
            </div>
          </div>
        </BlogLayout>
      );
}

export default withNotification(AllBlogPage);