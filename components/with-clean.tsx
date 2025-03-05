
import deleteImage from "@/services/firebase/deleteImage";
import deleteImageRecord from "@/services/firebase/deleteImageRecord";
import getObjectsByKeys from "@/services/firebase/getObjectsByKeys";
import searchObjectsByKey from "@/services/firebase/searchObjectsByKey";
import { getTempImageKeys, hasTempImageKeys, removeTempImageKey } from "@/services/storage-services";
import { isEmpty } from "lodash";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";

const withClean = (WrapperComponent: NextPage<any>) => {

    // eslint-disable-next-line react/display-name
    return (props: any) => {
        const [status, setStatus] = useState(0);

        const removeTempImage = async (key: any, url: any) => {

            return Promise.all([deleteImageRecord(key, "temp"), deleteImage(url)]);
        }

        useEffect(() => {
            if (status === 0)
                setStatus(1);
            if (status === 1 && hasTempImageKeys()) {
                const keys = getTempImageKeys();
                getObjectsByKeys(keys, "temp")
                    .then(objects => {
                        objects.forEach(object => {
                            const {key, url} = object;
                            searchObjectsByKey("innerKey", key, "images").then(res => {
                                if (isEmpty(res)) {
                                    removeTempImage(key, url).then(res => {
                                        removeTempImageKey(key);
                                    });
                                }
                            })
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching objects:', error);
                    });
            }
        }, [status]);
        return <WrapperComponent {...props} removeTempImage = {removeTempImage} />;
    }
}

export default withClean;