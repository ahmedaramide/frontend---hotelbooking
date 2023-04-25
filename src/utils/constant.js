export const runtimeEnvironment =
  import.meta.env.VITE_APP_RUNTIME_ENVIRONMENT || "dev";

//dev
export const devBaseUrl =
  import.meta.env.VITE_APP_DEV_BASE_URL || "http://localhost:6006";

//prod
export const prodBaseUrl =
  import.meta.env.VITE_APP_PROD_BASE_URL || "https://hotel.co";

//booking api key from rapid API
export const bookingApiKey = import.meta.env.VITE_APP_BOOKING_API_KEY || "";

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
