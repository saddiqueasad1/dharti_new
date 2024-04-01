import { BaseUrl, BaseUrl1, Apikey } from "../utills/Constants";
import { ApiManager } from "./ApiManager";



var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("X-API-KEY", Apikey);
var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
};

export const getDataofHomePage = async () => {
  try {
    const response = await fetch(BaseUrl + "listings", requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); // This reads and parses the JSON response body
    return data.data; // Return the parsed data
  } catch (error) {
    console.error("Error fetching home data:", error);
    // alert("Home data API crashed");
    throw error; // Re-throw the error so that it can be caught by the caller
  }
};


export const getAllData = async (query_Params) => {
  // Construct query parameters
  const queryParams = new URLSearchParams({
    search: query_Params?.search || "",
    locations: query_Params?.locations ? query_Params?.locations.join(",") : "",
    categories:query_Params?.categories,
    page: query_Params?.page,
    custom_fields: JSON.stringify(query_Params?.custom_fields || {}),
    price_range: query_Params?.price_range
      ? JSON.stringify(query_Params?.price_range)
      : "",
    listing_type: query_Params?.listing_type || "",
  });

  const endpoint = "listings";
  // Create the complete URL
  const apiUrl = `${BaseUrl}${endpoint}?${queryParams.toString()}`;

  return fetch(apiUrl, requestOptions)
    .then(async (response) => {

      let data = await response.json();
      return data?.data;
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error fetching data:", error);
      return [];
    });
};

export const getAllDataByLocation = async (queryParams) => {
  try {
    const response = await ApiManager.get(`ad/location`, queryParams);
    return response?.data;
  } catch (error) {
    console.log(error);
    return []; // or some default value as needed
  }
};
export const getDataofAdByID = async (id) => {
  try {
    const response = await ApiManager.get("listings/" + id);
    return response;
  } catch (error) {
    console.log(error);
    return []; // or some default value as needed
  }
};
export async function addPostAd(formData) {
  try {
    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const resp = await fetch(BaseUrl1 + "ad/adPost", requestOptions);
    let response = await resp.json();
    return response;
  } catch (error) {
    console.error("crashed", error);
    throw error; // Re-throw the error to handle it at a higher level if necessary
  }
}
export const geVehicleMakes = async (type) => {
  console.log("type", type);
  try {
    const response = await ApiManager.get("listings", args);
    if (response) return response;
    return [];
  } catch (error) {
    return []; // or some default value as needed
  }
};
////////////////////////////////////////////////
export const geVehicleCategory = async (type) => {
  console.log("type", type);
  try {
    const response = await ApiManager.get(`ad/findVehicleSubCategory/${type}`);
    if (!response?.success) {
      throw new Error("vehicle category error");
    }
    if (response?.data[0]?.category) {
      return response?.data[0]?.category;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false; // or some default value as needed
  }
};
export const getModel = async (type, value) => {
  try {
    const response = await ApiManager.get(`ad/findModels/${type}/${value}`);
    if (response?.data[0]?.model) {
      return response?.data[0]?.model;
    }
    return false;
  } catch (error) {
    return false; // or some default value as needed
  }
};
export const deleteAdById = async (id) => {
  try {
    const response = await ApiManager.delete("my/listings", { listing_id: id });
    return response
  } catch (error) {
    return []; // or some default value as needed
  }
};
export const toggleFavorite = async (listing_id) => {
  try {
    const response = await ApiManager.post(`my/favourites`,{listing_id:listing_id});
    return response
  } catch (error) {
    console.log("--------",error);
    return []; // or some default value as needed
  }
};
export const togglePublish = async (id) => {
  try {
    const response = await ApiManager.patch(`ad/muteAd/${id}`);
    return response;
  } catch (error) {
    console.log(error);
    return []; // or some default value as needed
  }
};
export const adView = async (adId) => {
  try {
    const response = await ApiManager.patch(`ad/addView?id=${adId}`);
  } catch (error) {
    console.log(error);
    return []; // or some default value as needed
  }
};
export const refreshApi = async (id) => {
  try {
    const response = await ApiManager.put(`ad/refreshAd/${id}`);
    return response;
  } catch (error) {}
};
export const editAdApi = async (id, formData) => {
  try {
    const requestOptions = {
      method: "PATCH",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const resp = await fetch(
      BaseUrl1 + `ad/edit-ad-mobile/${id}`,
      requestOptions
    );
    let response = await resp.json();
    return response;
  } catch (error) {
    console.error("crashed", error);
    throw error; // Re-throw the error to handle it at a higher level if necessary
  }
};
export const backEndDataAPi = async (data) => {
  try {
    const res = await ApiManager.get(
      `ad/get-postAd-data/${data.cat}/${data.subcat}`
    );
    return res?.data;
  } catch (error) {}
};
