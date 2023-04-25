import axios from "axios";
import API from "../utils/axiosInstances/api";
import { bookingApiKey } from "../utils/constant";

export const signUp = async (formData) => {
  return await API.post("/register", formData);
};

export const signIn = async (formData) => {
  return await API.post("/login", formData);
};

export const getUser = async () => {
  return await API.get("/user-profile");
};

// Get user bookings lists
export const getUserBookings = async () => {
  return await API.get(`/user-booking`);
};

// Get availability of room
export const getRoomAvailability = async (formData) => {
  return await API.post(`/rooms/booking/available`, formData);
};

// Book a room
export const bookRoom = async (formData) => {
  return await API.post(`/rooms/booking`, formData);
};

// Book multiple room
export const bookMultipleRoom = async (formData) => {
  return await API.post(`/rooms/booking/multiple`, formData);
};

export const requestForgotPassword = async (formData) => {
  return await API.post("/auth/password/reset", formData);
};

export const resetForgotPassword = async (formData) => {
  return await API.put("/auth/password/reset", formData);
};

export const getHotels = async (query) => {
  return await API.get(`/hotels?${query}`);
};

export const getTopHotels = async () => {
  return await API.get("/hotels/top");
};

export const getHotel = async (hotelId) => {
  return await API.get(`/hotels/${hotelId}`);
};

export const getHotelRooms = async (hotelId, query) => {
  return await API.get(`/rooms/hotel/${hotelId}?${query}`);
};

export const getHotelComments = async (hotelId, query) => {
  return await API.get(`/comments/hotel/${hotelId}?${query}`);
};

export const addComment = async (formData) => {
  return await API.post("/comments", formData);
};

export const getRoom = async (roomId) => {
  return await API.get(`/rooms/${roomId}`);
};

export const createHotel = async (formData) => {
  return await API.post(`/hotels`, formData);
};

export const updateHotel = async (id, formData) => {
  return await API.put(`/hotels/${id}`, formData);
};

export const deleteHotel = async (id) => {
  return await API.delete(`/hotels/${id}`);
};

export const addRoom = async (formData) => {
  return await API.post(`/rooms`, formData);
};

export const updateRoom = async (id, formData) => {
  return await API.put(`/rooms/${id}`, formData);
};

export const deleteRoom = async (id) => {
  return await API.delete(`/rooms/${id}`);
};

// Get admin dashboard
export const getAdminDashboard = async () => {
  return await API.get(`/admin/dashboard`);
};

// Get admin bookings lists
export const getAdminBookings = async () => {
  return await API.get(`/admin/bookings`);
};

// HOTEL API FROM BOOKING.COM
export const getHotelsFromAPI = async () => {
  const options = {
    method: "GET",
    url: "https://booking-com.p.rapidapi.com/v1/hotels/search",
    params: {
      adults_number: "2",
      dest_id: "-553173",
      locale: "en-gb",
      checkin_date: "2023-09-23",
      filter_by_currency: "AED",
      room_number: "1",
      order_by: "popularity",
      units: "metric",
      dest_type: "city",
      checkout_date: "2023-09-24",
      include_adjacency: "true",
      page_number: "0",
    },
    headers: {
      "X-RapidAPI-Key": bookingApiKey,
      "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
    },
  };

  const response = axios
    .request(options)
    .then(function (response) {
      return response.data?.result;
    })
    .catch(function (error) {
      console.error(error);
      return [];
    });
  return response;
};
