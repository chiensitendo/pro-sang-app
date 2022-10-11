import {FULL_DATETIME_FORMAT} from "../constants";
import moment from "moment";

export const getFullDatetimeString = (datetime: string) => {
    if (!datetime) {
        return "";
    }

    return moment(datetime, FULL_DATETIME_FORMAT).format(FULL_DATETIME_FORMAT);
}

export const getNumber = (num: number | undefined | null) => {
    if (!num) return 0;
    return num;
}

export const arrayToString = (array: string[] | undefined) => {
    if (!array || array.length === 0) return "";

    return array.join(",");
}

export const stringToArray = (string: string | undefined | null): string[] => {
    if (!string) {
        return [];
    }
    return string.split(",");
}