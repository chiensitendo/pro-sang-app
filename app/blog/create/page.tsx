"use client";

import BlogLayout from "@/components/blog/blog-layout";
import styles from "./CreateBlog.module.scss";
import withNotification from "@/components/with-notification";
import { Button, Form, Input, Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import getTranslation from "@/components/translations";
import { useLocale } from "next-intl";
import { UploadChangeParam } from "antd/lib/upload";
import { MAX_TEXT_LENGTH } from "@/constants";
import dynamic from "next/dynamic";
import { ComponentType, useEffect, useRef, useState } from "react";
import { ReactQuillProps } from "react-quill";
import ReactQuill from "react-quill";

const Editor = dynamic<ReactQuillProps>(
  () => import("react-quill").then((mod) => mod),
  { ssr: false }
);

interface CreateBlogForm {
  banner: UploadChangeParam<UploadFile>;
}

const CreateBlog = () => {
  const locale = useLocale();
  const [form] = Form.useForm<CreateBlogForm>();
  const [editor, setEditor] = useState<React.ReactElement>();
  const quillRef = useRef();
  const bannerMessage = getTranslation(
    "validation.name.required",
    "Please input the banner!",
    locale
  );

  const onFinish = (values: CreateBlogForm) => {
    console.log("values", values);

    if (
      !values.banner ||
      !values.banner.fileList ||
      values.banner.fileList.length === 0
    ) {
      form.setFields([
        {
          name: "banner",
          value: undefined,
          errors: [bannerMessage],
        },
      ]);
      return;
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    // console.log('Failed:', errorInfo);
  };

  return (
    <BlogLayout>
      <div className={styles.CreateBlog}>
        <Form
          name="blog"
          //   labelCol={{ span: 8 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Banner"
            name="banner"
            rules={[
              {
                required: true,
                message: bannerMessage,
              },
            ]}
          >
            <Upload listType="picture" multiple={false}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: getTranslation(
                  "validation.name.required",
                  "Please input the blog title!",
                  locale
                ),
              },
            ]}
          >
            <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
          </Form.Item>
          <Form.Item name="content">
            {/* <ReactQuill modules={{imageResize: {}}}/> */}
            <Editor
              theme="snow"
              bounds={'.app'}
              modules={{
                toolbar: [
                  [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                  [{size: []}],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
                  [{'list': 'ordered'}, {'list': 'bullet'}, 
                   {'indent': '-1'}, {'indent': '+1'}],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
                clipboard: {
                  // toggle to add extra line breaks when pasting HTML:
                  matchVisual: false,
                },
              }}
              formats={[
                "header",
                "font",
                "size",
                "bold",
                "italic",
                "underline",
                "strike",
                "blockquote",
                "code-block",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
                "video",
                "divider"
              ]}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              //   disabled={isSubmit}
            >
              {"Preview"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </BlogLayout>
  );
};

export default withNotification(CreateBlog);
