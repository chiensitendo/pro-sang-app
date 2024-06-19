"use client";

import { Avatar, Card, Space, Tag } from "antd";
import styles from "./blog-item.module.scss";
import Meta from "antd/es/card/Meta";
import React from "react";

const BlogItem = () => {
  return (
    <div className={styles.BlogItem}>
      <Card

        hoverable
        style={{ width: '100%', maxWidth: 360 , padding: 10}}
        cover={
          <img
            alt="example"
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        }
        actions={[
            <div className={styles.user_info}>
                <div className={styles.avatar_group}>
                    <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                    <p>Tracey Wilson</p>
                </div>
                <p>August 20, 2022</p>
            </div>
        ]}
      >
        <Meta
          title="The Impact of Technology on the Workplace: How Technology is Changing"
          description= {<React.Fragment>
            <Tag color="blue">blue</Tag>
            <Tag color="blue">blue</Tag>
          </React.Fragment>}
        />
      </Card>
    </div>
  );
};

export default BlogItem;
