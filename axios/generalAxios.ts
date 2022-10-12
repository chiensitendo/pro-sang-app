import axios from "axios";
import {API_TIMEOUT} from "../constants";
import * as https from "https";

const generalAxios = axios.create({
    timeout: API_TIMEOUT,
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
generalAxios.interceptors.request.use(
  async function (request) {
      return request;
  },
    function (error) {
        return Promise.reject(error);
    },
)

generalAxios.interceptors.response.use(
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

  export default generalAxios;