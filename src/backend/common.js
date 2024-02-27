import { ApiManager } from "./ApiManager";

export const getCategory = async () => {
  try {
    const response = await ApiManager.get('categories');
    return response?.data || response;
  } catch (error) {
    console.error("Signup API crashed", error);
  }
};
