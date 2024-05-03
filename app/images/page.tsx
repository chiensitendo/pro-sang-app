"use client";

import styles from "./images.module.scss";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import cls from "classnames";
import { Button, Image, Select } from 'antd';
import { changePublicImageListLimit, fetchNextPublicImageList, fetchPublicImageList } from "@/redux/reducers/image/publicImageListSlice";
import ProHeader from "@/components/core/header/ProHeader";
import { getImageUrl } from "@/types/image";
import withNotification from "@/components/with-notification";
import Banner from "@/components/banner";


const Theme1 = ({ images }: { images: string[] }) => {

    const [current, setCurrent] = useState(0);
    const galleryRef: LegacyRef<HTMLDivElement> = useRef(null);
    const getVal = function (elem: any, style: any) { return parseInt(window.getComputedStyle(elem).getPropertyValue(style)); };
    const getHeight = function (item: any) {
        return item?.children.item(0).getBoundingClientRect().height;
    };
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

    return <div className={styles.Theme1}>
        <Image.PreviewGroup items={images} preview={{
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
                        <Image src={image} alt=""
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
                            }} />
                    </div>
                </div>)}

            </div>
        </Image.PreviewGroup>


    </div>
}

const Theme2 = () => {

    return <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="grid gap-4">
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg" alt=""/>
            </div>
        </div>
        <div className="grid gap-4">
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg" alt=""/>
            </div>
        </div>
        <div className="grid gap-4">
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg" alt=""/>
            </div>
        </div>
        <div className="grid gap-4">
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg" alt=""/>
            </div>
            <div>
                <img className="h-auto max-w-full rounded-lg" src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg" alt=""/>
            </div>
        </div>
    </div>
    
}

const PublicImageListPage = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(0);
    const { count, images, limit, offset, loading } = useSelector(
        (state: RootState) => state.image.public.list
    );

    const shouldLoadMore = useMemo(() => {
        if (!images || count === 0) {
            return false;
        }
        return (count - images.length) > 0;
    }, [count, limit, images, offset]);

    useEffect(() => {
        if (status === 0) {
            setStatus(1);
        }
        if (status === 1)
            dispatch(fetchPublicImageList({ limit, offset}));
    }, [status]);

    return <div className={cls(styles.PublicImageListPage)}>
        <ProHeader/>
        <Banner/>
        {images && <div className={styles.viewItem}>
            <p>View: </p>
            <Select
                defaultValue={20}
                onChange={e => dispatch(changePublicImageListLimit({ offset: 0, limit: e
                }))}
                options={[
                    { value: 1, label: '1 items' },
                    { value: 5, label: '5 items' },
                    { value: 10, label: '10 items' },
                    { value: 20, label: '20 items' },
                ]}
            />
        </div>}
        {images && <Theme1 images={images.map(i => getImageUrl(i))} />}
        {shouldLoadMore && <div className={styles.loadMoreBtn}><Button onClick={() => dispatch(fetchNextPublicImageList({limit, offset: offset + limit
        }))} loading={loading}>Load more</Button></div>}
    </div>
}

export default withNotification(PublicImageListPage);