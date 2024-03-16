import axios from "axios";
import { BaseUrl } from "../../src/utills/Constants";

const axiosInstance = axios.create({
  baseURL: 'https://www.dhartipak.com/wp-json/rtcl/v1/',
  headers: {
    'Accept': 'application/json',
    'X-API-KEY': 'd4561754-9a28-4a7a-9a98-58da30dbab39'
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response && response.data;
  },
  (error) => {
    throw error.response ? error.response.data : { error: "Something went wrong", error };
  }
);

// Set the default timeout for API requests
const apiRequestTimeOut = 30000; // 30 secs

const setAuthToken = (token) =>
  axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;

const removeAuthToken = () => delete axiosInstance.defaults.headers.common["Authorization"];

const setMultipartHeader = () =>
  axiosInstance.defaults.headers.common["Content-Type"] = "multipart/form-data";

const removeMultipartHeader = () => delete axiosInstance.defaults.headers.common["Content-Type"];


export const ApiManager = {
   get : async (endpoint, params = {}) => {
    try {
      console.log('Requesting endpoint:', endpoint);
  
      // Check if there are any parameters to be sent with the request.
      let config = {};
      if (Object.keys(params).length > 0) {
        config.params = params;
      }
  
      // Making a GET request with optional parameters.
      const response = await axiosInstance.get(endpoint, config);
      return response;
    } catch (error) {
      console.error("Error occurred in get", endpoint);
      console.error("Error occurred while making a GET request: ", error);
      throw error; // Re-throw the error to be handled by the caller.
    }
  },
  post: async (endpoint, body, params = {}) => {
    console.log("endpoint: ",endpoint);
    console.log("body: ",body);
    console.log("params: " ,params);
    console.log("axiosInstance: " ,axiosInstance);
    try {
      const response = await axiosInstance.post(endpoint, body);
      return response;

    } catch (error) {
      console.log('error',error);
      console.error("Error occurred in post ", endpoint);
      return error;
    }
  },
  put: async (endpoint, body, params = {}) => {
    try {
      const response = await axiosInstance.put(endpoint, body, { params });
      return response;
    } catch (error) {
      console.error("Error occurred in put ", endpoint);
      throw error;
    }
  },
  patch: async (endpoint, body, params = {}) => {
    try {
      const response = await axiosInstance.patch(endpoint, body, { params });
      return response;
    } catch (error) {
      console.error("Error occurred in patch ", endpoint);

      throw error;
    }
  },
  delete: async (endpoint, params = {}) => {
    try {
      const response = await axiosInstance.delete(endpoint, { params });
      return response;
    } catch (error) {
      console.error("Error occurred in delete ", endpoint);
      throw error;
    }
  },
  setAuthToken,
  removeAuthToken,
  setMultipartHeader,
  removeMultipartHeader
};
