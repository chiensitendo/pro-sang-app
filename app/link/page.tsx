"use client";

import React, { useState, ChangeEvent, useRef, useEffect, useMemo } from "react";
import styles from "./link.module.scss";
import { Button, Input, message, Spin } from "antd";
import { isEmpty } from "lodash";
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  EditOutlined,
} from "@ant-design/icons";
import withNotification from "@/components/with-notification";
import ProHeader from "@/components/core/header/ProHeader";
import Banner from "@/components/banner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LinkResponse } from "@/types/link";
import { useDispatch } from "react-redux";
import { addNewItem, cancelLinkAction, createLinkAction, editLinkAction, fetchLinkList, fetchNextLinkList, updateLinkAction } from "@/redux/reducers/link/linkSlice";
import withAuth from "@/components/with-auth";
export interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
  is_edit: boolean;
  is_loading: boolean;
  is_new: boolean;
  is_url: boolean;
  id?: number;
}

function isValidUrl(urlString: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-zA-Z0-9\\-\\._]+)\\.([a-zA-Z]{2,5}))|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ipv4
      "(\\:\\d+)?" + // optional port
      "(\\/[^\\s]*)?$",
    "i"
  ); // optional path
  return pattern.test(urlString);
}

const LinkPreviewInput: React.FC<{
  link: LinkPreviewData;
  onComplete: (data: LinkPreviewData, isEdit: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
}> = ({ link, onComplete, onEdit, onCancel }) => {
  const {is_edit, is_loading, id} = link;
  console.log(link);
  const [url, setUrl] = useState<string>("");
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const pastedUrl = event.target.value;
    setUrl(pastedUrl);
  };

  const handleSave = () => {
    const emptyData: LinkPreviewData = {
      title: "",
      description: "",
      image: "",
      url: url,
      is_edit: false,
      is_loading: true,
      is_new: false,
      is_url: isValidUrl(url)
    };
    if (link.is_new) {
      onComplete(emptyData, false);
      // setPreviewData(emptyData);
      
    } else {
      onComplete({...emptyData, id: link.id}, true);
    }
    setUrl("");
    
  };

  const makePreviewLink = (linkData: LinkPreviewData) => {
    const emptyData = {
      description: '',
      image: '',
      is_edit: false,
      is_loading: false,
      is_new: false,
      is_url: linkData.is_url,
      title: '',
      url: linkData.url,
      id: linkData.id
    } as LinkPreviewData;
    setLoading(true);
    fetch(`/api/preview?url=${encodeURIComponent(linkData.url)}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (isEmpty(data.error)) {
          setPreviewData(data);
          setLoading(false);
        } else {
          setPreviewData(emptyData);
          setLoading(false);
        }
      })
      .catch((err) => {
        setPreviewData(emptyData);
        setLoading(false);
      });
  }

  const copyToClipboard = async (text: string) => {
    const t = text.trim();
    if (t === "") return;
    try {
      await navigator.clipboard.writeText(t);
      message.success("Copied!");
    } catch (err) {
      message.error("Failed to copy!");
    }
  };

  useEffect(() => {
    if (link.is_url)
      makePreviewLink(link);
    else
    setPreviewData({
      description: '',
      image: '',
      is_edit: false,
      is_loading: false,
      is_new: false,
      is_url: link.is_url,
      title: '',
      url: link.url,
      id: link.id
    });
    
  },[link]);

  return (
    <div className={styles.LinkPreviewInput}>
      {(is_edit || is_loading) && (
        <Spin spinning={loading}>
          <div className={styles.input_container}>
            <Input
              disabled={loading}
              type="text"
              placeholder="Paste a social media link..."
              value={url}
              onChange={handleInputChange}
            />
            <Button
              disabled={loading}
              onClick={onCancel}
              icon={<CloseOutlined />}
            />
            <Button
              disabled={loading}
              onClick={handleSave}
              icon={<CheckOutlined />}
            />
          </div>
        </Spin>
      )}
      {!is_edit && !is_loading && previewData && (
        <div className={styles.preview_container}>
          {previewData.image && (
            <img
              src={previewData.image}
              alt="Link preview"
              className={styles.preview_image}
            />
          )}
          <div className={styles.preview_content}>
            {previewData.title && (
              <a
                href={previewData.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.preview_title}
              >
                {previewData.title}
              </a>
            )}
            {previewData.description && (
              <p className={styles.preview_description}>
                {previewData.description}
              </p>
            )}
            {isValidUrl(previewData.url) ? (
              <a
                href={previewData.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.preview_url}
              >
                {previewData.url}
              </a>
            ) : (
              <p>{previewData.url}</p>
            )}
          </div>
          <div className={styles.edit_buttons}>
            <Button
              disabled={loading}
              onClick={() => copyToClipboard(link.url)}
              icon={<CopyOutlined />}
            />
            <Button
              disabled={loading}
              className={styles.button}
              onClick={() => {
                setUrl(link.url);
                onEdit();
              }}
              icon={<EditOutlined />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const LinkPage = () => {
  const {shownItems, items, count, loading, limit, offset} = useSelector((state: RootState) => state.link);
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const handleAddLink = () => {
    dispatch(addNewItem());
    setTimeout(() => {
      ref.current?.scrollIntoView();
    }, 10);
  };
  const handleCancel = (indexToRemove: number) => {
    dispatch(cancelLinkAction(indexToRemove));
  };

  const handleOnLinkComplete = (indexx: number, data: LinkPreviewData, isEdit: boolean) => {
    if (isEdit) {
      dispatch(updateLinkAction({
        id: data.id!,
        request: {
          is_url: data.is_url,
          url: data.url
        }
      }));
    } else {
      dispatch(createLinkAction({
        is_url: data.is_url,
        url: data.url
      }));
    }
  };

  const handleOnEditComplete = (indexx: number) => {
    dispatch(editLinkAction(indexx));
  };

  const shouldLoadMore = useMemo(() => {
    if (!items || count === 0) {
        return false;
    }
    return (count - items.length) > 0;
}, [count, limit, items, offset]);

  useEffect(() => {
    dispatch(fetchLinkList({
      limit,
      offset
    }));
  },[]);

  return (
    <div className={styles.LinkPage}>
      <ProHeader />
      <Banner />
      <div className={styles.link_wrapper}>
      <div className="flex_center">
          {<Button ref={ref} onClick={handleAddLink}>
            Add New Link
          </Button>}
        </div>
        <div className={styles.link_container}>
          {shownItems.map((link, index) => (
            <LinkPreviewInput
              key={index}
              link={link}
              onComplete={(data, isEdit) => handleOnLinkComplete(index, data, isEdit)}
              onEdit = {() => handleOnEditComplete(index)}
              onCancel={() => handleCancel(index)}
            />
          ))}
        </div>
        {shouldLoadMore && <div className="flex_center">
          {<Button loading= {loading} onClick={() => {
            dispatch(fetchNextLinkList({limit, offset: offset + limit}))
          }}>
            Load more
          </Button>}
        </div>}
      </div>
    </div>
  );
};

export default withNotification(withAuth(LinkPage));
