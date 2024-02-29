"use client";

import { useParams, useRouter } from "next/navigation";
import styles from "./folderImageList.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import { changeFolderImageListLimit, deleteImages, fetchFolderImageList, fetchNextFolderImageList, openDeleteModal, openUploadImageModal, refreshFolderImageList, selectImageItem } from "@/redux/reducers/image/folderImageListSlice";
import cls from "classnames";
import { Button, Image, Select, Spin, Switch, Tag } from 'antd';
import FolderDescription from "@/components/folder/FolderDescription";
import { fetchFolderById, updateFolder } from "@/redux/reducers/folder/folderDetailReducer";
import FolderMenu from "@/components/folder/FolderMenu";
import { ImageItem } from "@/types/folder";
import DeleteImageModal from "@/components/image/DeleteImageModal";
import UploadImageModal from "@/components/image/UploadImageModal";
import withAuth from "@/components/with-auth";
import ProHeader from "@/components/core/header/ProHeader";
import { stopScrollToBottom } from "@/redux/reducers/lyric/lyricCommentSlice";
import { getImageUrl } from "@/types/image";
import withNotification from "@/components/with-notification";
import Banner from "@/components/banner";


const getFolderIdx = (folderName: string) => {

    const idx = ["", ""];
    if (folderName) {
        const a = folderName.split("_");
        const [name] = a;
        idx[0] = name;
        idx[1] = a[a.length - 1];
    }
    return idx;
}

const Theme1 = ({ images }: { images: Array<{ url: string, id: number, item: ImageItem }>, shouldScrollToBottom: boolean }) => {

    const [current, setCurrent] = useState(0);
    const galleryRef: LegacyRef<HTMLDivElement> = useRef(null);
    const getVal = function (elem: any, style: any) { return parseInt(window.getComputedStyle(elem).getPropertyValue(style)); };
    const getHeight = function (item: any) {
        return item?.children.item(0).getBoundingClientRect().height;
    };
    const dispatch = useDispatch();

    const { selectedImages } = useSelector(
        (state: RootState) => state.image.folder.list
    );

    let statuses = useMemo(() => 0, [images]);

    const ref = useRef(null);
    const getGaleryItems = (item: any) => {
        const items: any[] = [];
        for (let i = 0; i < item.children.length; i++) {
            item.children.item(i).classList.forEach((v: string) => {
                if (v.includes("galleryItem")) {
                    items.push(item.children.item(i));
                }
            })
        }
        return items;

    }

    useEffect(() => {
        if (galleryRef?.current) {
            window.addEventListener("resize", function (e) {
                getGaleryItems(galleryRef.current).forEach(item => {
                    const altura = getVal(galleryRef.current, 'grid-auto-rows');
                    const gap = getVal(galleryRef.current, 'grid-row-gap');
                    item.style.gridRowEnd = "span " + Math.ceil((getHeight(item) + gap) / (altura + gap));
                });
            });
        }
    }, [galleryRef]);

    // useEffect(() => {
    //     if (shouldScrollToBottom) {
    //         if (galleryRef?.current) {
    //             (galleryRef.current as any)?.scrollIntoView({ behavior: "smooth" });
    //         }
    //         dispatch(stopScrollToBottom());
    //     }
    // },[dispatch, shouldScrollToBottom, galleryRef]);

    return <div className={styles.Theme1}>
        <Image.PreviewGroup items={images.map(i => i.url)} preview={{
            current: current, onChange: (current, prev) => {
                setCurrent(current);
            }, afterOpenChange(open) {
                if (!open) {
                    setCurrent(0);
                }
            },
        }}>
            <div className={styles.gallery} id="gallery" ref={galleryRef}>
                {images.map((image, index) => <div key={index} className={styles.galleryItem}>
                    <div className={styles.content}>
                        {image.item.is_public && <Tag color="success" className={styles.tag}>Public</Tag>}
                        {!image.item.is_public && <Tag color="default" className={styles.tag}>Private</Tag>}

                        <Switch className={styles.checkbox} checked={selectedImages.has(image.id) ? true : false} onChange={v => {
                            dispatch(selectImageItem({
                                checked: selectedImages.has(image.id) ? true : false,
                                item: image.item
                            }))
                        }}></Switch>
                        <Image src={image.url} alt=""
                            onClick={() => setCurrent(index)}
                            fallback="data:image/png;base64,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"
                            onLoad={function (e) {
                                const gallery = document.getElementById('gallery');
                                const altura = getVal(gallery, 'grid-auto-rows');
                                const gap = getVal(gallery, 'grid-row-gap');
                                const node = e.currentTarget.parentElement?.parentElement;
                                if (node) {
                                    node.style.gridRowEnd = "span " + Math.ceil((getHeight(node) + gap) / (altura + gap));
                                }
                            statuses++;
                            }} />
                    </div>
                </div>)}

            </div>
        </Image.PreviewGroup>


    </div>
}

const FolderImageListPage = ({isAuth}: {isAuth: boolean}) => {
    const router = useRouter();
    const params = useParams<{ folderName: string }>();
    const { folderName } = params ?? { folderName: '' };
    const [name, id] = getFolderIdx(folderName);
    const dispatch = useDispatch();
    const { count, images, limit, offset, loading, selectedImages, isOpenDeleteModal, isOpenUploadImageModal, shouldScrollToBottom } = useSelector(
        (state: RootState) => state.image.folder.list
    );
    const [status, setStatus] = useState(0);

    const { folder, loading: folderLoading } = useSelector(
        (state: RootState) => state.folder.detail
    );

    const shouldLoadMore = useMemo(() => {
        if (!images || count === 0) {
            return false;
        }
        return (count - images.length) > 0;
    }, [count, limit, images, offset]);

    const refresh = (shouldRefresh: boolean) => {
        if (shouldRefresh) {
            folder && dispatch(refreshFolderImageList({
                folderId: folder.id,
                limit: 20,
                offset: 0
            }));
        } else {
            dispatch(openUploadImageModal({
                open: false
            }));
        }
        
    }

    useEffect(() => {
        
        if (status === 0) {
            setStatus(1);
        }
        if (id && +id && status === 1) {
            dispatch(fetchFolderImageList({
                folderId: +id, limit, offset
            }));
            dispatch(fetchFolderById(+id));
            setStatus(1);
        }
    }, [status, id]);

    return <div className={cls(styles.FolderImageListPage)}>
        <ProHeader/>
        <Banner/>
        <div>
            {folder && <FolderDescription folder={folder} onDescription={description => dispatch(updateFolder({
                id: folder.id,
                request: {
                    description
                }
            }))} />}
        </div>
        {images && <FolderMenu />}
        {images && folder && <div className={styles.viewItemWrapper}>
            <div className={styles.viewItem}>
                <p>View: </p>
                <Select
                    defaultValue={20}
                    value={limit}
                    onChange={e => dispatch(changeFolderImageListLimit({
                        folderId: folder.id, offset: 0, limit: e
                    }))}
                    options={[
                        { value: 1, label: '1 items' },
                        { value: 5, label: '5 items' },
                        { value: 10, label: '10 items' },
                        { value: 20, label: '20 items' },
                    ]}
                />
            </div>
            <div>Selected: {selectedImages.getCount()}</div>
        </div>}
        {images && <Spin spinning={loading} 
        tip="Loading..."><Theme1 shouldScrollToBottom = {shouldScrollToBottom} images={images.map(i => ({ url: getImageUrl(i), id: i.id, item: i }))} /></Spin>}
        {shouldLoadMore && folder && <div className={styles.loadMoreBtn}><Button onClick={() => dispatch(fetchNextFolderImageList({
            folderId: folder.id, limit, offset: offset + limit
        }))} loading={loading}>Load more</Button></div>}
        <DeleteImageModal open={isOpenDeleteModal} onOk={() => !selectedImages.isEmpty() && dispatch(deleteImages({
            images: selectedImages.getItems().map((v: ImageItem) => v.id)
        }))} onCancel={() => dispatch(openDeleteModal({ open: false }))} />
        {folder && <UploadImageModal open={isOpenUploadImageModal} onOk={(shouldRefresh) => refresh(shouldRefresh)} 
        onCancel={(shouldRefresh) => refresh(shouldRefresh)} folder={folder} />}
    </div>
}

export default withNotification(withAuth(FolderImageListPage));