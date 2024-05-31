import { isEmpty } from "lodash";
import { UserDataItem } from "./account";

export const getAvatar=(userInfo?: UserDataItem) => {
    if (isEmpty(userInfo) || isEmpty(userInfo.crop_avatar)) {
        return `https://api.dicebear.com/7.x/miniavs/svg?seed=${1}`;
    }
    return `https://s3.cloudfly.vn/avatar/user${userInfo.user_id}/${userInfo.crop_avatar}`;
}