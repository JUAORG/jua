import axios from "axios";

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
    })
}

export async function markAllUserNotificationsAsRead(values) {
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_notifications/`,
        withCredentials: false,
    })
}

export async function markUserNotificationAsRead(ref) {
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/user_profile_notifications/${ref}`,
        withCredentials: false,
    })
}
