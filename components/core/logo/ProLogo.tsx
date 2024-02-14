import styles from "./ProLogo.module.scss";

const ProLogo = () => {

    return <div className={styles.logo}>
    <nav className={styles.topBar} onClick={() => window.location.href = "/"}>
        <span>Sang</span><strong>Pro</strong>
    </nav>
</div>
}

export default ProLogo;