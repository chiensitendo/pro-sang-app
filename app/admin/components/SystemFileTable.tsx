import { Button, Progress, Space, Table, Tag } from "antd";
import styles from "./SystemFileTable.module.scss";
import { TableProps } from "antd/lib";
import { AdminFolderItem } from "@/types/admin";
import { useMemo } from "react";

interface DataType extends AdminFolderItem {
    key: string;
  }
  
  
  


const SystemFileTable = ({folders, onSync, onSyncImages}: {folders: AdminFolderItem[], 
    onSync: (folderName: string) => void, onSyncImages: (folderId: number) => void}) => {

    const columns: TableProps<DataType>['columns'] = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Total',
          dataIndex: 'count',
          key: 'count',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Database',
          key: 'is_database_sync',
          dataIndex: 'is_database_sync',
          render: (_, { is_database_sync }) => {
            return is_database_sync ? <Tag color="green">Sync</Tag> : <Tag color="volcano">Not Sync</Tag>
          },
        },
        {
            title: 'Storage',
            key: 'is_storage_sync',
            dataIndex: 'is_storage_sync',
            render: (_, { is_storage_sync }) => {
              return is_storage_sync ? <Tag color="green">Sync</Tag> : <Tag color="volcano">Not Sync</Tag>
            },
          },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <Button onClick={() => onSync(record.name)} 
              disabled = {(record.is_database_sync && record.is_storage_sync)}>Sync</Button>
              <Button disabled={(!record.is_database_sync || !record.is_storage_sync) 
              || record.count === 0 || (record.count === record.database_count && record.database_count === record.storage_count)}
              onClick={() => record.id && onSyncImages(record.id)}>Sync All Images</Button>
            </Space>
          ),
        },
      ];

    const data = useMemo(() => {
        return folders.map((f, i) => ({key: i.toString(), ...f}));
    },[folders]);
    return <div className={styles.SystemFileTable}>
        <Table columns={columns} dataSource={data} expandable={{
          expandedRowRender: (record) => 
          <Space>
            <div className={styles.processItem}>
              <h4>Database</h4>
              <Progress type="circle" size={"small"} percent={(record.database_count/record.count) * 100} 
            format={() =>`${record.database_count}/${record.count}`} />
            </div>
            <div className={styles.processItem}>
              <h4>Storage</h4>
              <Progress type="circle" size={"small"} percent={(record.storage_count/record.count) * 100} 
            format={() =>`${record.storage_count}/${record.count}`}/>
            </div>
          </Space>
        }} />
    </div>
}

export default SystemFileTable;