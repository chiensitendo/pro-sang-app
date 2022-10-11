import {AxiosResponse} from "axios";
import generalAxios from "../axios/generalAxios";

export const getShellName = (name: string): Promise<AxiosResponse> => {
    return generalAxios.get<any>(process.env.apiUrl + `/shell-name${name ? `?name=${name}`: ''}`);
}

