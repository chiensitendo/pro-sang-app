import { Avatar, Divider, Tag } from "antd";
import styles from "./blog-detail.module.scss";

const BlogDetail = ({tags, title, content, avatar, fullName}: {tags: string[], title: string, content: string, avatar: string, fullName: string}) => {
    
    return <div className={styles.BlogDetail}>
    <div className={styles._tagContainer}>
        {tags.map((tag, index) => <Tag key={index} color="#108ee9">{tag}</Tag>)}
    </div>
    <h1 style={{wordBreak: 'break-word'}}><strong>{title}</strong></h1>
    <div className={styles._userContainer}>
        <div className={styles.user_info}>
            <div className={styles.avatar_group}>
                <Avatar src={avatar} />
                <p>{fullName}</p>
            </div>
            <p>August 20, 2022</p>
        </div>
    </div>
    <Divider/>
    <div>
        <div className={styles.BlogContent} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
</div>
}


export default BlogDetail;