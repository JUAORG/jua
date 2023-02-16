import axios from "axios"
import { get } from 'lodash'
import { getAuthTokenCookie, defaultHeaders } from "./Auth"


export async function uploadUserProfile(values) {
    const formData = new FormData()
    formData.append('file', values)
    const fileUploadHeaders = defaultHeaders
    fileUploadHeaders['Content-Type'] = 'multipart/form-data'

    return axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_picture/`,
        withCredentials: false,
        headers: fileUploadHeaders,
        data: formData
    })
}

export async function editUserProfile(values) {
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile/`,
        withCredentials: false,
        headers: defaultHeaders,
        data: values
    })
}

export async function createUserEducation(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_education/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}

export async function updateUserEducation(values) {
  return axios({
    method: 'PATCH',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_education/${get(values, 'ref')}/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}

export async function deleteUserEducation(values) {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_education/${get(values, 'ref')}/`,
    withCredentials: false,
    headers: defaultHeaders,
  })
}


export async function createUserExperience(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_experience/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}

export async function updateUserExperience(values) {
  return axios({
    method: 'PATCH',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_experience/${get(values, 'ref')}/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}

export async function deleteUserExperience(values) {
  return axios({
    method: 'DELETE',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_experience/${get(values, 'ref')}/`,
    withCredentials: false,
    headers: defaultHeaders
  })
}
