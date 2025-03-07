
import { notification } from "antd";
import { NextPage } from "next";
import React, {useEffect, useMemo} from "react";
import {ErrorMessage, GlobalError} from "../types/error";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {removeErrorNotification, removeMessageNotification} from "../redux/reducers/notificationSlice";
import { useLocale } from "next-intl";
import getTranslation from "./translations";
import { isEmpty } from "lodash";
const openError = (message: string, locale?: string | undefined) => {
    notification['error']({
      message: getTranslation("lyric.notification.error", 'Error', locale),
      description:
      message,
      duration: 2.5,
      placement: 'bottomRight'
    });
};

const openSuccess = (message: string, locale?: string | undefined) => {
    notification['success']({
      message: 'Success',
      description:
      message,
      duration: 2.5,
      placement: 'bottomRight'
    });
};

const withNotification = (WrapperComponent: NextPage<any>) => {

    // eslint-disable-next-line react/display-name
    return () => {
        const locale = useLocale();
        const {error, message} = useSelector((state: RootState) => state.notification);
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
                const error2: ErrorMessage = err;
                if (error2.message) {
                    openError(error2.message, locale);
                } else {
                    openError("Oops! Something went wrong.", locale);
                }
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
            if (!isEmpty(error)) {
                handleErrors(error);
                dispatch(removeErrorNotification());
            }
        },[error, dispatch, handleErrors]);
        useEffect(() => {
            
            if (message) {
                handleSuccess(message);
                dispatch(removeMessageNotification());
            }
        },[message, dispatch, handleSuccess]);
        return <WrapperComponent onErrors = {handleErrors} onSuccess = {handleSuccess}/>;
    }
}

export default withNotification;