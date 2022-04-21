import axios from "axios";
import { refreshTokenAPI } from "../apis/auth-apis";
import { getSessionAccessToken, getSessionRefreshToken, getSessionUsername, isSessionAccessTokenExpired, isSessionRefreshTokenExpired, setRefreshTokenSessionStorage } from "../services/session-service";
import { RefreshTokenResponse } from "../types/account";

const authAxios = axios.create();
authAxios.interceptors.request.use(
  async function (request) {
    let accessToken = getSessionAccessToken();
    if (isSessionAccessTokenExpired()) {
      if (isSessionRefreshTokenExpired()) {
          window.location.href = "/login";
          return;
      } else {
          const token = getSessionRefreshToken();
          const username = getSessionUsername();
          try {
            const res = await refreshTokenAPI({
              refreshToken: token,
              username: username
            });
            const response = res.data.body as RefreshTokenResponse;
            accessToken = response.accessToken;
            setRefreshTokenSessionStorage(response);
          } catch (err) {
            window.location.href = "/login";
          }
      }
    }
    request.headers = {
      'Access-Control-Allow-Origin': '*',
      'Authorization': `Bearer ${accessToken}`,
      ...request.headers,
    }
    return request;
  }
)

authAxios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  export default authAxios;