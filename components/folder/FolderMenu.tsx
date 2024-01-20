import { Button } from "antd";
import styles from "./FolderMenu.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useCallback, useMemo } from "react";
import { ImageItem } from "@/types/folder";
import { useDispatch } from "react-redux";
import { changeAllPublicOfImages, changePublicOfImages, openDeleteModal } from "@/redux/reducers/image/folderImageListSlice";

const FolderMenu = () => {
    const {selectedImages, images} = useSelector((state: RootState) => state.image.folder.list);
    const {folder} = useSelector((state: RootState) => state.folder.detail);
    const dispatch = useDispatch();
    const count = useMemo(() => {
        return selectedImages.getCount();
    },[selectedImages]);

    const items: ImageItem[] = useMemo(() => {
        return selectedImages.getItems();
    },[selectedImages]);

    const publicCount = useMemo(() => {
        return items.filter(i => i.is_public).length;
    },[items]);

    const handleChangePublicAll = useCallback((isPublic: boolean) => {
        if (!images || !folder) {
            return;
        }
        const list = images.filter(i => i.is_public === !isPublic);
        if (list.length > 0) {
            dispatch(changeAllPublicOfImages({
                folderId: folder.id,
                request: {
                    images: [],
                    is_public: isPublic
                }
            }));
        }
    },[images, folder, dispatch]);


    const privateCount = count - publicCount;

    return <div className={styles.FolderMenu}>
        <Button type="primary" onClick={() => handleChangePublicAll(true)}>Make public all</Button>
        <Button className="orange_primary_button" type="primary" onClick={() => handleChangePublicAll(false)}>Make private all</Button>
        <Button className="green_primary_button" type="primary" disabled = {privateCount <= 0} onClick={() => dispatch(changePublicOfImages({
            images: items.filter(i => !i.is_public).map(i => i.id),
            is_public: true
        }))}>Make public ({privateCount})</Button>
        <Button type="default"  disabled = {publicCount <= 0} onClick={() => dispatch(changePublicOfImages({
            images: items.filter(i => i.is_public).map(i => i.id),
            is_public: false
        }))}>Make private ({publicCount})</Button>
        <Button type="primary" danger disabled = {count <= 0} onClick={() => dispatch(openDeleteModal({open: true}))}>Delete: ({count})</Button>
    </div>
}

export default FolderMenu;