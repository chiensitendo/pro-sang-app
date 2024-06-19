import styles from "./blog-banner.module.scss";
import { Avatar, Card, Tag } from "antd";
import Meta from "antd/es/card/Meta";

const BlogBanner = ({isHomePage}: {isHomePage: boolean}) => {


  const tags = ['blue', 'blue', 'blue', 'blue'];
  const title = 'The Impact of Technology on the Workplace: How Technology is Changing';
  const user = {name: 'Tracey Wilson'}
  const createdTime = 'August 20, 2022';
  return (
    <div className={styles.BlogBanner}>
      <div className={styles.image_wrapper}>
        <img
          src={
            "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt="banner"
        />
        { isHomePage ? <Card hoverable className={styles.card} 
            style={{width: 'calc(100% - 40px)', maxWidth: 500, padding: 10}}
            actions={[
              <div className={styles.user_info}>
                  <div className={styles.avatar_group}>
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                      <p>{user.name}</p>
                  </div>
                  <p>{createdTime}</p>
              </div>
          ]}>
            <Meta description = {<div className={styles.description}>
              <div className={styles.tag_container}>
                {tags.map((tag,index) => <Tag key={index} color="blue">{tag}</Tag>)}
              </div>
                <p>
                  <b>{title}</b>
                </p>
            </div>}/>
        </Card>: <Card hoverable className={styles.card_all}
            style={{width: '100%', maxWidth: 500, padding: 10}}
            actions={[
              <div className={styles.user_info}>
                  <div className={styles.avatar_group}>
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                      <p style={{color: 'white'}}>{user.name}</p>
                  </div>
                  <p style={{color: 'white'}}>{createdTime}</p>
              </div>
          ]}>
            <Meta description = {<div className={styles.description_all}>
              <div className={styles.tag_container}>
                {tags.map((tag,index) => <Tag key={index} color="#108ee9">{tag}</Tag>)}
              </div>
                <p>
                  <b>{title}</b>
                </p>
            </div>}/>
        </Card>}
      </div>
    </div>
  );
};

export default BlogBanner;
