import axios from "axios";
import {API_TIMEOUT} from "../constants";


const clientAxios = axios.create({timeout: API_TIMEOUT});
clientAxios.interceptors.request.use(
  async function (request) {
      return request;
  },
    function (error) {
        return Promise.reject(error);
    },
)

clientAxios.interceptors.response.use(
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

  export default clientAxios;