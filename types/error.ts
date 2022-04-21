import { notification } from "antd";

export interface GlobalError {
    errors?: ErrorItem[];
    validations?: ErrorItem[];
}

interface ErrorItem {
    [key: string]: string;
}


export const handleErrors = (err: any) => {
    const [api, contextHolder] = notification.useNotification();
    const error: GlobalError = err;
    if (!error.errors && !error.validations) {
        const placement = "topLeft";
        api.info({
            message: `Notification ${placement}`,
            description: `<hellooo`,
            placement,
        });
    } else {

    }
}