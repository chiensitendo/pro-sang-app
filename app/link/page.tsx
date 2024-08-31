"use client";

import React, {
  useState,
  ChangeEvent,
  useRef,
  useEffect,
  useMemo,
} from "react";
import styles from "./link.module.scss";
import { Button, Input, message, Spin } from "antd";
import { isEmpty } from "lodash";
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import withNotification from "@/components/with-notification";
import ProHeader from "@/components/core/header/ProHeader";
import Banner from "@/components/banner";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { LinkPreviewData } from "@/types/link";
import { useDispatch } from "react-redux";
import {
  addNewItem,
  cancelLinkAction,
  createLinkAction,
  deleteLinkAction,
  editLinkAction,
  fetchLinkList,
  fetchNextLinkList,
  updateLinkAction,
} from "@/redux/reducers/link/linkSlice";
import withAuth from "@/components/with-auth";

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

const makePreviewData = (linkData: LinkPreviewData) => {
  return new Promise<LinkPreviewData>((resolve, reject) => {
    const emptyData = {
      description: linkData.description,
      image: linkData.image,
      is_edit: false,
      is_loading: false,
      is_new: false,
      is_url: linkData.is_url,
      title: linkData.title,
      url: linkData.url,
      id: linkData.id,
    } as LinkPreviewData;
    if (!linkData.is_url) {
      resolve(emptyData);
    } else {
      fetch(`/api/preview?url=${encodeURIComponent(linkData.url)}`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (isEmpty(data.error)) {
            resolve({
              ...linkData,
              image: data.image,
              description: data.description,
              title: data.title,
            });
          } else {
            resolve(emptyData);
          }
        })
        .catch((err) => {
          resolve(emptyData);
        });
    }
  });
};

const LinkPreviewInput: React.FC<{
  linkPreviewData: LinkPreviewData;
  onComplete: (data: LinkPreviewData, isEdit: boolean) => void;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
}> = ({ linkPreviewData, onComplete, onEdit, onCancel, onDelete }) => {
  const { is_edit, is_loading, id } = linkPreviewData;
  const [url, setUrl] = useState<string>("");
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
      is_url: isValidUrl(url),
    };
    handleMakePreviewData(emptyData, linkPreviewData.is_new);
    setUrl("");
  };

  const handleMakePreviewData = (data: LinkPreviewData, isNew: boolean) => {
    setLoading(true);
    if (isNew) {
      makePreviewData(data)
        .then((d) => onComplete(d, false))
        .finally(() => setLoading(false));
    } else {
      makePreviewData({ ...data, id: data.id })
        .then((d) => onComplete(d, true))
        .finally(() => setLoading(false));
    }
  };

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
      {!is_edit && !is_loading && (
        <div className={styles.preview_container}>
          {linkPreviewData.image && (
            <img
              src={linkPreviewData.image}
              alt="Link preview"
              className={styles.preview_image}
            />
          )}
          <div className={styles.preview_content}>
            {linkPreviewData.title && (
              <a
                href={linkPreviewData.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.preview_title}
              >
                {linkPreviewData.title}
              </a>
            )}
            {linkPreviewData.description && (
              <p className={styles.preview_description}>
                {linkPreviewData.description}
              </p>
            )}
            {linkPreviewData.is_url ? (
              <a
                href={linkPreviewData.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.preview_url}
              >
                {linkPreviewData.url}
              </a>
            ) : (
              <p>{linkPreviewData.url}</p>
            )}
          </div>
          <div className={styles.edit_buttons}>
            <Button
              disabled={loading}
              onClick={() => copyToClipboard(linkPreviewData.url)}
              icon={<CopyOutlined />}
            />
            <Button
              disabled={loading}
              className={styles.button}
              onClick={() => {
                setUrl(linkPreviewData.url);
                onEdit();
              }}
              icon={<EditOutlined />}
            />
            <Button
              disabled={loading}
              className={styles.button}
              onClick={() => {
                handleMakePreviewData(linkPreviewData, false);
              }}
              icon={<RedoOutlined />}
            />
            {(linkPreviewData.id) && <Button
              disabled={loading}
              danger
              onClick={() => onDelete(linkPreviewData.id!)}
              icon={<DeleteOutlined />}
            />}
          </div>
        </div>
      )}
    </div>
  );
};

const LinkPage = () => {
  const { shownItems, items, count, loading, limit, offset } = useSelector(
    (state: RootState) => state.link
  );
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

  const handleOnLinkComplete = (
    indexx: number,
    data: LinkPreviewData,
    isEdit: boolean
  ) => {
    if (isEdit) {
      dispatch(
        updateLinkAction({
          id: data.id!,
          request: {
            is_url: data.is_url,
            url: data.url,
            description: data.description,
            image: data.image,
            title: data.title,
          },
        })
      );
    } else {
      dispatch(
        createLinkAction({
          is_url: data.is_url,
          url: data.url,
          description: data.description,
          image: data.image,
          title: data.title,
        })
      );
    }
  };

  const handleOnEditComplete = (indexx: number) => {
    dispatch(editLinkAction(indexx));
  };

  const shouldLoadMore = useMemo(() => {
    if (!items || count === 0) {
      return false;
    }
    return count - items.length > 0;
  }, [count, limit, items, offset]);

  useEffect(() => {
    dispatch(
      fetchLinkList({
        limit,
        offset,
      })
    );
  }, []);

  return (
    <div className={styles.LinkPage}>
      <ProHeader />
      <Banner />
      <div className={styles.link_wrapper}>
        <div className="flex_center">
          {
            <Button ref={ref} onClick={handleAddLink}>
              Add New Link
            </Button>
          }
        </div>
        <div className={styles.link_container}>
          {shownItems.map((link, index) => (
            <LinkPreviewInput
              key={index}
              linkPreviewData={link}
              onComplete={(data, isEdit) =>
                handleOnLinkComplete(index, data, isEdit)
              }
              onEdit={() => handleOnEditComplete(index)}
              onCancel={() => handleCancel(index)}
              onDelete={id => dispatch(deleteLinkAction(id))}
            />
          ))}
        </div>
        {shouldLoadMore && (
          <div className="flex_center">
            {
              <Button
                loading={loading}
                onClick={() => {
                  dispatch(
                    fetchNextLinkList({ limit, offset: offset + limit })
                  );
                }}
              >
                Load more
              </Button>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default withNotification(withAuth(LinkPage));
