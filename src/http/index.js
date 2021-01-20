import axios from "axios";

export const baseURL = process.env.NODE_ENV ? '' : '/kc2j/'

const axiosInstance = axios.create({
  baseURL: baseURL,
  // baseURL: Config.instance().api,
  timeout: 1000 * 30,
});
axiosInstance.defaults.withCredentials = true;

export default axiosInstance