import axios from "axios";
import { runtimeEnvironment, devBaseUrl, prodBaseUrl } from "../constant";
import { decode, hotelToken } from "../helpers";

const baseURL = runtimeEnvironment === "dev" ? devBaseUrl : prodBaseUrl;

const API = axios.create({ baseURL });

API.interceptors.request.use(async (req) => {
  const encodedToken = window.localStorage.getItem(hotelToken);
  const token = decode(encodedToken);

  req.headers.Authorization = `Bearer ${token}`;

  return req;
});

export default API;
