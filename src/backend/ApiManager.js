import axios from "axios";
import { BaseUrl, Apikey } from "../../src/utills/Constants";

axios.defaults.baseURL = BaseUrl;

const apiRequestTimeOut = 30000; // 30 secs

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

export const ApiManager = {
  get: async (endpoint, params = {}) => {
    try {
      console.log('endpointendpoint------', endpoint);
      const response = await axiosInstance.get(endpoint);
      return response;
    } catch (error) {
      console.log("000ali of gettt");
      throw error;
    }
  },
  post: async (endpoint, body, params = {}) => {
    console.log("endpoint: ",endpoint);
    console.log("body: ",body);
    console.log("params: " ,params);
    console.log("axiosInstance: " ,axiosInstance);
    try {
      const response = await axiosInstance.post(endpoint, body);
      console.log('responseresponse',response);
      return response;

    } catch (error) {
      console.log('error',error);
      throw error;
    }
  },
  put: async (endpoint, body, params = {}) => {
    try {
      const response = await axiosInstance.put(endpoint, body, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
  patch: async (endpoint, body, params = {}) => {
    try {
      const response = await axiosInstance.patch(endpoint, body, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint, params = {}) => {
    try {
      const response = await axiosInstance.delete(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
