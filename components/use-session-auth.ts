import { getSessionUserInfo, isSessionAccessTokenExpired, isSessionLogging, setLoginSessionStorage } from "@/services/session-service";
import { LoginResponseV2, UserDataItem } from "@/types/account";
import { getAvatar } from "@/types/user";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react"

export const useSessionAuth = () => {
    const [userInfo, setUserInfo] = useState<LoginResponseV2 | null>(null);
    const [avatar, setAvatar] = useState<string>();
    const getFullName = () => {
        if (!userInfo) return "";
        if (!userInfo.first_name) return userInfo.last_name;
        if (!userInfo.last_name) return userInfo.first_name;

        return userInfo.first_name + " " + userInfo.last_name;
    }

    const updateUserData = (info: UserDataItem) => {
        const {crop_avatar, crop_cover, original_avatar, original_cover, id, user_id} = info;
        const item = getSessionUserInfo();
        if (!isEmpty(item)) {
            const data = {...item, user_data: {crop_avatar: crop_avatar, crop_cover: crop_cover, original_avatar: original_avatar, 
                original_cover: original_cover, id: id, user_id: user_id}};
            setLoginSessionStorage(data);
        }
        updateAvatar(info);

    }

    const updateAvatar = (info: UserDataItem | undefined) => {
        setAvatar(getAvatar(info));
    }

    useEffect(() => {
        const isLogging = isSessionLogging();
        let info = undefined;
        if (isLogging) {
            if (isSessionAccessTokenExpired()) {
                //Nothing do
            } else  {
                const item = getSessionUserInfo();
                setUserInfo(item);
                info = item?.user_data;

            }
        }
        updateAvatar(info);
    },[]);
    return {
        userInfo,
        avatar,
        isValidAccount: userInfo?.is_verify && userInfo?.is_active,
        getFullName,
        setAvatar,
        updateUserData,
    }
}