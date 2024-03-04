import axios from "axios"
import storageService from "./storage"
const baseUrl = "/api/blogs"

const headers = {
  Authorization: storageService.loadUser()
    ? `Bearer ${storageService.loadUser().token}`
    : null,
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  console.log(response)
  return response.data
}

const create = async (object) => {
  const response = await axios.post(baseUrl, object, { headers })
  return response.data
}

const update = async (object) => {
  const response = await axios.put(`${baseUrl}/${object.id}`, object, {
    headers,
  })
  return response.data
}

const remove = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, { headers })
}

const createComment = async (object) => {
  const response = await axios.post(`${baseUrl}/${object.id}/comments`, { comment: object.comment }, {
    headers,
  })
  return response.data
}

export default { getAll, create, update, remove, createComment }
