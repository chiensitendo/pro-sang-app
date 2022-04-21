import { notification } from "antd";
import { NextPage } from "next";
import React from "react";
import {GlobalError} from "../types/error";
const openError = (message: string) => {
    notification['error']({
      message: 'Error',
      description:
      message,
      duration: 2.5
    });
};

const openSuccess = (message: string) => {
    notification['success']({
      message: 'Success',
      description:
      message,
      duration: 2.5
    });
};

const withNotification = (WrapperComponent: NextPage<any>) => {
    // eslint-disable-next-line react/display-name
    return () => {
        const handleErrors = (err: any) => {
            const error: GlobalError = err;
            if (!error.errors && !error.validations) {
                openError("Unknown Error");
            } else {
                if (error.errors) {
                    error.errors.forEach(v => {
                        Object.keys(v).forEach(key => {
                            openError(v[key]);
                        });
                    })
                }
                if (error.validations) {
                    error.validations.forEach(v => {
                        Object.keys(v).forEach(key => {
                            openError(`${key}: ${v[key]}`);
                        });
                    })
                }
            }
            
        }
        const handleSuccess = (mes: string) => {
            openSuccess(mes);
        }
        return <WrapperComponent onErrors = {handleErrors} onSuccess = {handleSuccess}/>;
    }
}

export default withNotification;