import axios from "axios";
import { defaultHeaders } from "./Auth";

export const notificationTypes = [
  {
    type: 'warning',
  },
];


export async function getUserNotifications(values) {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_notifications/`,
        withCredentials: false,
        headers: defaultHeaders
    })
}

export async function markAllUserNotificationsAsRead(values) {
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_notifications/`,
        withCredentials: false,
        headers: defaultHeaders
    })
}

export async function markUserNotificationAsRead(ref) {
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_notifications/${ref}`,
        withCredentials: false,
        headers: defaultHeaders
    })
}
