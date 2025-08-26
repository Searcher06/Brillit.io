import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
axios.defaults.withCredentials = true;

export default axios;
