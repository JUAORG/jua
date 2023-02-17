import axios from "axios"
import { defaultHeaders } from "./Auth"


export async function submitJuaPlatformFeedback(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_feedback/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}

export async function fetchFrequentlyAskedQuestions(values) {
  return axios({
    method: 'GET',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/frequently_asked_questions/`,
    withCredentials: false,
  })
}