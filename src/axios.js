import axios from "axios"


 const baseURL="http://192.168.142.158:2000/api/"

const instance = axios.create({
  baseURL,
})

export default {
  instance,
  baseURL,
}
