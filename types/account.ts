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