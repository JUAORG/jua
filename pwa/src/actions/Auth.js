import { get, head, unset, assign } from 'lodash'
import axios from "axios"
import cookie from 'react-cookies'
import notificationManager from './NotificationManager'
import { createId } from '../utils/uuid-generator'

export const setAuthId = (uid) => {
  localStorage.setItem("auth_id", uid)
  localStorage.setItem("date_auth_id_set", new Date())
}

export const getAuthId = () => {
  return localStorage.getItem("auth_id")
}

export const clearAuthTokenCookie = () => cookie.remove('auth_token', { path: '/' })
export const getAuthTokenCookie = () => cookie.load('auth_token', { path: '/' })

export const setAuthTokenCookie = (authToken) => {
  clearAuthTokenCookie()
  cookie.save('auth_token', authToken, { path: '/' })
}


export const defaultHeaders = {
  'Authorization': `token ${getAuthTokenCookie()}`,
  'Content-Type': 'application/json'
}

export async function getUser() {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user/`,
    withCredentials: false,
    headers: defaultHeaders,
  })
}

export const removeAuthId = () => {
  localStorage.removeItem("auth_id")
  localStorage.removeItem("date_auth_id_set")
}


export const isSignedIn = () => {
  const pathName = window.location.pathname
  const loginPath = "/login"
  const registerPath = "/register"
  const notFoundPath = "/404"
  const isSignedIn = getAuthId()

  if (!isSignedIn && pathName !== loginPath && pathName !== registerPath && pathName !== notFoundPath) {
    window.location.href = registerPath
  }
}

export async function emailAndPasswordRegister(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/register/`,
    data: {
      first_name: values.first_name,
      last_name: values.last_name,
      username: values.email,
      password: values.password
    }
  })
}

export async function emailAndPasswordSignIn(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/login/`,
    data: {
      username: values.email,
      password: values.password
    }
  })
}

export async function logout(){
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/logout/`,
    headers: defaultHeaders
  })
}


