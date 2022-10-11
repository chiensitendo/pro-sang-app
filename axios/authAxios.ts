import axios from "axios";
import {GlobalError} from "../types/error";
import {API_TIMEOUT} from "../constants";

const authAxios = axios.create({
    timeout: API_TIMEOUT
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
        if (!error.response || !error.response.data) {
            return Promise.reject(error);
        }
        const errorObj: GlobalError = error.response.data;
        if (!errorObj.errors && !errorObj.validations) {
            return Promise.reject(error);
        }
      return Promise.reject(error.response.data);
    }
  );

  export default authAxios;