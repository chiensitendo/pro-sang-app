import styles from "./HandWriteList.module.scss";


export interface HandWriteListItem {
    id: number;
    name: string;
}
const HandWriteList = ({ list = [] }: { list?: Array<HandWriteListItem> }) => {

    return <div className={styles.HandWriteListContainer}>
        <ul>
            {list.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
    </div>
}


export default HandWriteList;