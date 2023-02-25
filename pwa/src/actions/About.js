import axios from 'axios'
import { defaultHeaders } from './Auth'


export async function submitJuaPlatformFeedback(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_feedback/`,
    withCredentials: false,
    headers: defaultHeaders,
    data: values
  })
}
