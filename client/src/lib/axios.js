import Axios from 'axios'

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-Witch" : "XMLHttpRequest"
  },
  withCredentials:true
});

export default axios