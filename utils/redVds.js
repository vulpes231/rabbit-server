// redVdsService.js
const axios = require("axios");

const API_BASE_URL = "https://api.redvds.com/v1";
const API_KEY = process.env.REDVDS;

const getPlans = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/system/getPlans`, {
      headers: {
        "X-API-Key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw new Error("Unable to fetch plans");
  }
};

const getList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/server/getList`, {
      headers: {
        "X-API-Key": API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching list:", error);
    throw new Error("Unable to fetch list");
  }
};

module.exports = {
  getPlans,
  getList,
};
