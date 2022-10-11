import { notification } from "antd";
import { NextPage } from "next";
import React, {useMemo} from "react";
import {GlobalError} from "../types/error";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {removeErrorNotification} from "../redux/reducers/lyric/notificationSlice";
import {useRouter} from "next/router";
import getTranslation from "./translations";
const openError = (message: string, locale?: string | undefined) => {
    notification['error']({
      message: getTranslation("lyric.notification.error", 'Error', locale),
      description:
      message,
      duration: 2.5
    });
};

const openSuccess = (message: string, locale?: string | undefined) => {
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
        const {locale} = useRouter();
        const {error} = useSelector((state: RootState) => state.notification);
        const dispatch = useDispatch();
        const handleErrors = (err: any) => {
            if (!err) {
                // openError("Unknown Error");
                openError("Oops! Something went wrong.", locale);
                return;
            }
            if ((typeof err) === 'string') {
                openError(err, locale);
                return;
            }
            const error: GlobalError = err;

            if (!error.errors && !error.validations) {
                // openError("Unknown Error");
                openError("Oops! Something went wrong.", locale);
            } else {
                if (error.errors) {
                    error.errors.forEach(v => {
                        Object.keys(v).forEach(key => {
                            openError(v[key], locale);
                        });
                    })
                }
                if (error.validations) {
                    error.validations.forEach(v => {
                        Object.keys(v).forEach(key => {
                            openError(`${key}: ${v[key]}`, locale);
                        });
                    })
                }
            }

        }
        const handleSuccess = (mes: string) => {
            openSuccess(mes, locale);
        }
        useMemo(() => {
            if (error) {
                handleErrors(error);
                dispatch(removeErrorNotification());
            }
        },[error, dispatch]);
        return <WrapperComponent onErrors = {handleErrors} onSuccess = {handleSuccess}/>;
    }
}

export default withNotification;