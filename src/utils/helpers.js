import { monthNames } from "./constant";
import jwt_decode from "jwt-decode";
export const hotelToken = "ht_^U&T";
export const userData = "ht_^U&T&Data";
import * as API from "../api/index";

export const encode = (jwt) => {
  if (typeof jwt === "string") {
    const [header, payload, signature] = jwt.split(".");

    const encodedHeader = btoa(header);
    const encodedPayload = btoa(payload);
    const encodedSig = btoa(signature);

    return btoa(`${encodedHeader}::${encodedPayload}::${encodedSig}`);
  }

  return;
};

export const decode = (text) => {
  if (typeof text === "string") {
    const decodedText = atob(text);
    const [header, payload, signature] = decodedText.split("::");

    const decodedHeader = atob(header);
    const decodedPayload = atob(payload);
    const decodedSig = atob(signature);
    return `${decodedHeader}.${decodedPayload}.${decodedSig}`;
  }

  return;
};

export const getUserLocally = async () => {
  let user = JSON.parse(window.localStorage.getItem(userData));

  if (!user) {
    const id = localGetUserId();

    if (id) {
      const response = await API.getUser();
      const userRes = response?.data?.data;
      window.localStorage.setItem(userData, JSON.stringify(userRes));
      user = userRes;
      return user;
    }
  }

  return user;
};

export const localGetUserId = () => {
  const encodedToken = window.localStorage.getItem(hotelToken);
  const token = decode(encodedToken);

  const decoded = jwt_decode(token);

  return decoded.userId;
};

export const getLocalAccessToken = () => {
  const encodedToken = window.localStorage.getItem(hotelToken);
  return decode(encodedToken);
};

export const formatDateToMonthAndDay = (dateString) => {
  const date = new Date(dateString);
  return `${
    monthNames[date.getMonth()]
  }, ${date.getDate()} ${date.getFullYear()}`;
};

export const logout = () => {
  window.localStorage.removeItem(hotelToken);
  window.localStorage.removeItem(userData);
  return;
};

export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
