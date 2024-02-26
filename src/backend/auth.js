import { BaseUrl, BaseUrl1 } from "../utills/Constants";
import { ApiManager } from "./ApiManager";

const signupApi = async (data) => {
  try {
    const response = await ApiManager.post("auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Signup API crashed", error);
  }
};
const loginApi = async (data) => {
  try {
    const response = await ApiManager.post("auth", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return false;
  }
};
const getOwneAd = async (id, getHidden = true) => {
  try {
    const response = await ApiManager.get(
      `auth/getUserAds/${id}/${getHidden}`
    );
    return response?.data;
  } catch (error) {
    return []; // or some default value as needed
  }
};
const getUserByID = async (id) => {
  try {
    const response = await ApiManager.get(`auth/getUser/${id}`);
    return response?.data;
  } catch (error) {
    return []; // or some default value as needed
  }
};
async function updateProfile(id, formData) {
  try {
    const requestOptions = {
      method: "PUT",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const resp = await fetch(
      BaseUrl1 + `auth/userProfile/${id}`,
      requestOptions
    );
    let response = await resp.json();
    console.log(response);
    return response?.data?.userDetails;
  } catch (error) {
    console.error("crashed", error);
    throw error; // Re-throw the error to handle it at a higher level if necessary
  }
}
const getFavAds = async (id) => {
  try {
    const response = await ApiManager.get(`auth/getFavAds/${id}`);
    // if (!response.success) {
    //   throw new Error("Network error home APi");
    // }
    return response?.data;
  } catch (error) {
    return []; // or some default value as needed
  }
};
const changePasswordAPI = async (id, data) => {
  try {
    const response = await ApiManager.post(`auth/change-password/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("change Password crashed", error);
  }
};
const getShowNumber = async (id) => {
  try {
    const response = await ApiManager.put(`auth/showNumber/${id}`);
    return response;
  } catch (error) {}
};
const getShowEmail = async (id) => {
  try {
    const response = await ApiManager.put(`auth/showEmail/${id}`);
    return response;
  } catch (error) {}
};
const getShowAds = async (id) => {
  try {
    const response = await ApiManager.put(`auth/showAds/${id}`);
    return response;
  } catch (error) {}
};
const forgetPasswordAPI = async (mail) => {
  try {
    const response = await ApiManager.post("auth/forgot-password", {
      email: mail,
    });

    // Handle the response here
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error.response.data);
  }
};
const verifyCodeAPI = async (code) => {
  try {
    const response = await ApiManager.get(`auth//verify-code/${code}`);

    // Handle the response here
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error.response.data);
  }
};
const resetPasswordAPI = async (p) => {
  try {
    const response = await ApiManager.post("auth/reset-password", p);

    // Handle the response here
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error.response.data);
  }
};
const verifycode = async (data) => {
  try {
    const response = await ApiManager.post("auth/resend-code", data);

    // Handle the response here
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error.response.data);
  }
};
const verifyAccount = async (data) => {
  try {
    const response = await ApiManager.post("auth/verify-account", data);

    // Handle the response here
    return response;
  } catch (error) {
    // Handle errors here
    console.error("Error:", error.response.data);
  }
};
const deleteAccountAPI = async (id, data) => {
  try {
    var requestOptions = {
      method: "DELETE",
      body: data,
      redirect: "follow",
    };

    let resp = await fetch(
      `${BaseUrl1}auth/delete-account/${id}`,
      requestOptions
    );
    let response = await resp.json();
    return response;
  } catch (error) {}
};

export {
  signupApi,
  loginApi,
  getOwneAd,
  getFavAds,
  updateProfile,
  getUserByID,
  changePasswordAPI,
  getShowNumber,
  getShowAds,
  forgetPasswordAPI,
  verifyCodeAPI,
  resetPasswordAPI,
  verifycode,
  verifyAccount,
  deleteAccountAPI,
  getShowEmail,
};
