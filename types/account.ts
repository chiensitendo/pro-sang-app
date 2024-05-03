import { RcFile } from "antd/lib/upload";
import {LyricStatuses} from "../apis/lyric-apis";

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
	id: number;
	username: string;
	email: string;
	photoUrl: string;
	name: string;
	accessToken: string;
	accessTokenExpiredTime: string;
	refreshToken: string;
	refreshTokenExpiredTime: string;
	role: Roles;
}

export interface AccountVerifyRequest {
    verifyToken: string;
    accountId: number;
}

export interface AccountVerifyResponse {
    is_verified: boolean;
    id: number;
	is_active: boolean;
}


export interface LoginResponseV2 {
	id: number;
	username: string;
	email: string;
	photo_url: string;
	name: string;
	access_token: string;
	expired_time: string;
	refresh_token: string;
	refresh_expired_time: string;
	role: Roles;
	session_id: string;
	is_verify: boolean;
	is_active: boolean;
	first_name: string;
	last_name: string;
}

export interface LyricRequest {
	title: string;
	content: string;
	description?: string;
	composers?: string;
	singers?: string;
	owners?: string;
	status: LyricStatuses;
	accountId: number;
}

export interface RefreshTokenRequest {
	username: string;
	refreshToken: string;
}

export interface RefreshTokenResponse {
	accessToken: string;
	accessTokenExpiredTime: string;
	refreshToken: string;
	refreshTokenExpiredTime: string;
}

export interface LoggingUserInfo {
	id: number;
	username: string;
	email: string;
	name: string;
	photoUrl: string;
	role: Roles;
}

export enum Roles {
	SUPER_ADMIN = "SUPER_ADMIN",
	ADMIN = "ADMIN",
	USER = "USER"
}

export enum RoleIds {
	SUPER_ADMIN = 0,
	ADMIN = 1,
	USER = 2
}

// Legacy
export interface CreateAccountRequest {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	photoUrl?: string;
	role: Roles;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	role_id: RoleIds;
	is_test?: boolean;
}

export interface CreateAccountResponse {
	username: string;
	email: string;
	id: number;
	created_date: string;
	updated_date: string;
}

export interface UserContactRequest {
	email: string;
	content: string;
	full_name: string;
	_ga?: string;
}

export interface ContactInfo {
	can_send: boolean;
	remaining_seconds: number;
}

export interface CoverRequest {
	originCover?: RcFile;
	cropCover: File;
}

export interface AvatarRequest {
	originAvatar?: RcFile;
	cropAvatar: File;
}

export interface UserDataItem {
	id: string,
	user_id: number,
	crop_cover: string,
	original_cover: string,
	crop_avatar: string,
	original_avatar: string
}

export interface UserInfoResponse {
	id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    created_time: string,
    updated_time: string,
    is_active: boolean,
    role_id: number,
    is_verify: boolean,
    verified_time: string,
	user_data?: UserDataItem
}

export interface UpdateUserRequest {
	first_name: string,
    last_name: string
}

export interface UpdateUserResponse {
	id: number,
	first_name: string,
    last_name: string
}