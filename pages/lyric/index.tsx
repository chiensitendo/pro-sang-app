import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import authAxios from "../../axios/authAxios";
import withAuth from "../../components/with-auth";
import withNotification from "../../components/with-notification";
import { LyricRequest } from "../../types/account";
import { NotificationProps } from "../../types/page";

const LyricPage: NextPage = (props: LyricPageProps) => {
   
    const {onSuccess, onErrors} = props;
    const [isLoad, setIsLoad] = React.useState(false);
    const router = useRouter();
    const handleCreate = async (req: LyricRequest) => {
        try {
            await authAxios.post(process.env.apiUrl + "/lyric", req);
            onSuccess && onSuccess("Lyric has been saved!");
            router.push("/lyric/list");
        } catch(err) {
            onErrors && onErrors(err);
            setIsLoad(false);
        }  
    }

    const onFinish = (values: LyricRequest) => {
        setIsLoad(true);
        handleCreate(values);
    };
    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <div className = "center-1">
        <Form
            name="lyric"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            >
            <Form.Item
                label="Lyric name"
                name="title"
                rules={[{ required: true, message: 'Please input your lyric name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Content"
                name="content"
                rules={[{ required: true, message: 'Please input your content!' }]}
            >
                <TextArea rows={5}/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" disabled ={isLoad}>
                Save
                </Button>
            </Form.Item>
        </Form>
    </div>
}

interface LyricPageProps extends NotificationProps {
   children?: any; 
}

export default withNotification(withAuth(LyricPage));