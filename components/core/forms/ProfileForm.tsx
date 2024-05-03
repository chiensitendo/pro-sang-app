import { Button, Form, Input, Space } from "antd";
import styles from "./ProfileForm.module.scss";
import getTranslation from "@/components/translations";
import { useLocale } from "next-intl";
import { MAX_TEXT_LENGTH } from "@/constants";
import { UpdateUserRequest, UserInfoResponse } from "@/types/account";
import { useEffect } from "react";
import { isEmpty } from "lodash";

interface ProfileFormSharp {
    firstName: string,
    lastName: string
}

const ProfileForm = ({userInfo, onUpdate}: {userInfo: UserInfoResponse, onUpdate: (req: UpdateUserRequest) => void}) => {
    const [form] = Form.useForm<ProfileFormSharp>();
    const locale = useLocale();
    const onFinish = (values: ProfileFormSharp) => {
        if (values.firstName === userInfo.first_name && values.lastName === userInfo.last_name) {
            return;
        }
        onUpdate({first_name: values.firstName, last_name: values.lastName});
    }

    useEffect(() => {
        if (!isEmpty(userInfo)) {
            form.setFieldValue('firstName', userInfo.first_name);
            form.setFieldValue('lastName', userInfo.last_name);
        }
    },[userInfo]);

    return <Form className={styles.ProfileForm} form={form} onFinish={onFinish}>
        <Form.Item
            label={getTranslation("account.firstName", "First Name", locale)}
            name="firstName"
            rules={[{ required: true, message: getTranslation("validation.firstName.required", 'Please input your first name!', locale) }]}
        >
            <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
        </Form.Item>
        <Form.Item
            label={getTranslation("account.lastName", "Last Name", locale)}
            name="lastName"
            rules={[{ required: true, message: getTranslation("validation.lastName.required", 'Please input your last name!', locale) }]}
        >
            <Input autoComplete="off" maxLength={MAX_TEXT_LENGTH} />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }} className={styles.ButtonItem}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                {getTranslation("button.edit", "Edit", locale)}
            </Button>
        </Form.Item>
    </Form>
}

export default ProfileForm;