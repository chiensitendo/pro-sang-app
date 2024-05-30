import axios from "axios";
import {API_TIMEOUT} from "../constants";


const generalAxios = axios.create({timeout: API_TIMEOUT, 
  baseURL: process.env.apiUrl
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