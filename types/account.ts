export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
	id: number;
	username: string;
	email: string;
	accessToken: string;
	accessTokenExpiredTime: string;
	refreshToken: string;
	refreshTokenExpiredTime: string;
}

export interface LyricRequest {
	title: string;
	content: string;
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