import axios from "axios";
import {GlobalError} from "../types/error";
import {API_TIMEOUT} from "../constants";
import * as https from "https";

const authAxios = axios.create({
    timeout: API_TIMEOUT,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
authAxios.interceptors.request.use(
  async function (request) {
    return request;
  },
    function (error) {
        return Promise.reject(error);
    },
)

authAxios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error && error.response && error.response.data) {
        return Promise.reject(error.response.data);
      } else {
        return Promise.reject(error);
      }
    }
  );

  export default authAxios;