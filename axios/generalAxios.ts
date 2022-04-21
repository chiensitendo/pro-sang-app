import axios from "axios";

const generalAxios = axios.create();
generalAxios.interceptors.request.use(
  function (request) {
    return request;
  }
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