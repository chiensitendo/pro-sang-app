import { AxiosResponse } from "axios";
import { authHeaders, preSessionAxiosButNotRequired } from "./common";
import generalAxios from "@/axios/generalAxios";

export const getAnonymousContactInfo = ({_ga, locale}: {_ga: string, locale?: string}): Promise<AxiosResponse> => {


    return new Promise<AxiosResponse>((resolve, reject) => {
        preSessionAxiosButNotRequired().then(obj => {
            generalAxios.get<any>(`/public/contact/${_ga}`,
            { headers: obj === null ? undefined : authHeaders({locale, ...obj}) as any})
            .then(res => resolve(res)).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}