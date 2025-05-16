import axios from 'axios';

export async function submitJuaPlatformFeedback(values) {
  return axios({
    method: 'POST',
    url: `${process.env.REACT_APP_API_BASE_URL}/api/user_feedback/`,
    withCredentials: false,
    data: values,
  });
}
