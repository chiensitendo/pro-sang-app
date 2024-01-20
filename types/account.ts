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
}

export enum Roles {
	SUPER_ADMIN,
	ADMIN,
	USER
}

export interface CreateAccountRequest {
	username: string;
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	photoUrl?: string;
	role: Roles;
}

export interface CreateAccountResponse {
	username: string;
	email: string;
	id: number;
	created_date: string;
	updated_date: string;
}