import axios from "axios";
const API_KEY = '31295064-d335bb900990de35b7797fc07';
const BASE_URL = 'https://pixabay.com/api/';

const apiInstane = axios.create({
  baseURL: BASE_URL
});

export const getImages = async (page = 1, name) => {
  const res = await apiInstane.get("", {
      params: {
        page,
        key: API_KEY,
        q: name,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        per_page: 40
    }
  });

  return res.data;
};
