import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // 10 seconds — fail fast instead of hanging

export default axios;
