"use client";

import withNotification from "@/components/with-notification";
import styles from "./index.module.scss";
import BlogLayout from "@/components/blog/blog-layout";
import BlogItem from "@/components/blog/blog-item";
import BlogBanner from "@/components/blog/blog-banner";
import { Button } from "antd";
import { useRouter } from "next/navigation";

const BlogPage = () => {

  const router = useRouter();
  return (
    <BlogLayout>
      <div className={styles.BlogPage}>
        <BlogBanner isHomePage ={true} />
        <div style={{textAlign: 'center', marginBottom: '20px'}}><h1>Latest Post</h1></div>
        <div className={styles.blog_container}>
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
            <BlogItem/>
        </div>
        <div className={styles.action_btn}>
          <Button onClick={() => router.push("/blog/all")}>View All Post</Button>
        </div>
      </div>
    </BlogLayout>
  );
};

export default withNotification(BlogPage);
