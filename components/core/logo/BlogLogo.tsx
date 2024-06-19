import styles from "./Logo.module.scss";

const BlogLogo = () => {

    return <div className={styles.logo}>
    <nav className={styles.topBar} onClick={() => window.location.href = "/"}>
        <span>Sang</span><strong>Blog</strong>
    </nav>
</div>
}

export default BlogLogo;