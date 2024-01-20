import { RootState } from "@/redux/store";
import { Alert, Avatar, List, Modal } from "antd";
import { useSelector } from "react-redux";
import styles from "./DeleteImageModal.module.scss";
import { ImageItem } from "@/types/folder";
import { useMemo } from "react";


const DeleteImageModal = ({open, onOk, onCancel}: {open: boolean, onOk: () => void, onCancel: () => void}) => {
    const { selectedImages } = useSelector(
        (state: RootState) => state.image.folder.list
    );
    const items: ImageItem[] = useMemo(() => {
        if (selectedImages.isEmpty()) {
            return [];
        }
        return selectedImages.getItems().map(v => v);
    },[selectedImages]);
    return <Modal 
    title={`Do you want to delete (${selectedImages.getCount()}) images ?`} 
    open={open} onOk={onOk} onCancel={onCancel}>
    <div className={styles.DeleteImageModal}>
    <List
    itemLayout="horizontal"
    dataSource={items}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={item.path ? `/public/${item.path}`: `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
          title={item.name}
          description={`Folder Id: ${item.folder_id}, Image Id: ${item.id}`}
        />
      </List.Item>
    )}
  />
    </div>
  </Modal>
}


export default DeleteImageModal;