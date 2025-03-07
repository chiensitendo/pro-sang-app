import { RootState } from "@/redux/store";
import { Avatar, List, Modal, Select } from "antd";
import { useSelector } from "react-redux";
import styles from "./MoveImageModal.module.scss";
import { ImageItem } from "@/types/folder";
import { useMemo, useState } from "react";


const MoveImageModal = ({ open, onOk, onCancel, sourceFolderId }: { open: boolean, sourceFolderId: number, onOk: (targetFolderId: number) => void, 
    onCancel: () => void }) => {

    const [folderId, setFolderId] = useState<number | undefined>(undefined);
    const { selectedImages } = useSelector(
        (state: RootState) => state.image.folder.list
    );

    const { count, folders } = useSelector(
        (state: RootState) => state.folder.list
    );

    const items: ImageItem[] = useMemo(() => {
        if (selectedImages.isEmpty()) {
            return [];
        }
        return selectedImages.getItems().map(v => v);
    }, [selectedImages]);
    return <Modal
        title={`Where do you want to move these (${selectedImages.getCount()}) images ?`}
        open={open} onOk={() => folderId && onOk(folderId)} onCancel={onCancel}>
        <div className={styles.MoveImageModal}>
            <div className={styles.FolderSelect}>
                <Select 
                // loading={loading} 
                onSelect={v => setFolderId(v)}
                >
                    {(folders ?? []).filter(v => v.id != sourceFolderId).map((folder, index) => <Select.Option key={index} value={folder.id}>{folder.name}</Select.Option>)}
                </Select>
            </div>
            <List
                itemLayout="horizontal"
                dataSource={items}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={item.path ? `/public/${item.path}` : `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                            title={item.name}
                            description={`Folder Id: ${item.folder_id}, Image Id: ${item.id}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    </Modal>
}


export default MoveImageModal;