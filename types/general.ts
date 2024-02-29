export interface ProSelectItem {
    label: string;
    value: any;
    id: number;
}

export enum HttpStatus {
    UNAUTHORIZED = 401,
    MAX_LOGIN_TIME = 4003,
    INACTIVE_ACCOUNT = 4004
}

export enum ErrorPageType {
    INACTIVE = 1
}

export const SESSION_HEADER = "x-pro-sang-session-id-header";