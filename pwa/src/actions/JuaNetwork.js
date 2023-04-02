import axios from 'axios';
import { map, get, size, merge, filter } from 'lodash';
import { createId } from '../utils/uuid-generator';
import { defaultHeaders, getAuthId } from './Auth';

const uid = getAuthId();
export const serviceRequestStatusOptions = {
    unread: 'Unread',
    read: 'Read',
    accepted: 'Accepted',
    declined: 'Declined',
    expired: 'Expired',
    pending: 'PENDING',
    approved: 'APPROVED',
    cancelled: 'CANCELLED',
    inProgress: 'IN_PROGRESS',
};

export const serviceRequestUserActions = {
    joined: 'joined',
    left: 'left',
};

export const activeJuaNetworkUsers = (users) => {
    return map(
        filter(
            users,
            (x) => x.industry && x.first_name !== null && x.uid !== uid
            //        x.profile_visible === true
        )
    );
};

export const activeJuaNetworkUsersForThisService = (service, users) => {
    const activeUsers = activeJuaNetworkUsers(users);
    return map(filter(activeUsers, (x) => x.industry === get(service, 'name')));
};

export async function fetchJuaNetworkUsers() {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/jua_network/`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function fetchJuaNetworkUser(id) {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/jua_network/${id}`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function createServiceRequest(values) {
    return axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_requests/`,
        withCredentials: false,
        headers: defaultHeaders,
        data: values,
    });
}

export async function fetchServiceRequests() {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_requests/`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function fetchServiceRequest(ref) {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_request/${ref}`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function fetchServiceRequestChat(ref) {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_requests/${ref}/comments`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function sendServiceRequestChatMessage(ref, values) {
    return axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_requests/${ref}/comments/`,
        withCredentials: false,
        headers: defaultHeaders,
        data: values,
    });
}

export async function fetchServiceRequestsForServiceProvider() {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_requests/?is_service_provider=True`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

// export async function createServiceRequest(values) {
//   const serviceRequestKey = createId()
//   values.serviceRequester = uid
//   values.id = serviceRequestKey
//   values.status = get(serviceRequestStatusOptions, 'unread')

//   // Updates[`/users/${uid}/service_requests/${serviceRequestKey}`] = values
//   // updates[`/users/${values.serviceProvider}/service_requests/${serviceRequestKey}`] = values
// }

export const submitActiveServiceRequestAction = (serviceRequestId, action) => {
    const serviceRequestActionDocument = {};
    serviceRequestActionDocument.user = uid;
    serviceRequestActionDocument.action = action;
    serviceRequestActionDocument.id = createId();
};

export async function updateServiceRequest(values) {
    console.debug(values, 'frrfr')
    return axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_request/${get(values, 'ref')}/`,
        withCredentials: false,
        headers: defaultHeaders,
        data: values,
    });
}

export async function completeServiceRequest(values) {
    const updates = {};
    const serviceRequestKey = values.id;
}

export async function submitServiceRequestFeedback(values) {
    return axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/service_request_feedback/`,
        withCredentials: false,
        headers: defaultHeaders,
        data: values,
    });
}

export const getActiveServiceRequests = (serviceRequests) => {
    return map(
        filter(serviceRequests, (x) => x.serviceProvider === uid),
        (x) => x
    );
};

export const filterExpiredOrDeclinedServiceRequests = (serviceRequests) => {
    return map(
        filter(
            serviceRequests,
            (x) =>
            x.status !== serviceRequestStatusOptions.declined &&
                x.status !== serviceRequestStatusOptions.expired &&
                x.status !== serviceRequestStatusOptions.cancelled
        )
    );
};

export const filterOldServiceRequests = (serviceRequests) => {
    return map(filter(serviceRequests, (x) => x.status === serviceRequestStatusOptions.expired));
};

export const getMyOldRecievedServiceRequests = (serviceRequests) => {
    const filteredOldServieRequests = filterOldServiceRequests(serviceRequests);
    return map(
        filter(filteredOldServieRequests, (x) => x.serviceProvider === uid),
        (x) => x,
        'user'
    );
};

export const getMySentServiceRequests = (serviceRequests) => {
    const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests);
    return map(
        filter(filteredServiceRequests, (x) => x.serviceRequester === uid),
        (x) => x,
        'user'
    );
};

export const getMyRecievedServiceRequests = (serviceRequests) => {
    const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests);
    return map(
        filter(filteredServiceRequests, (x) => x.serviceProvider === uid),
        (x) => x,
        'user'
    );
};

export const getNumOfMyServiceRequests = (serviceRequests) => {
    const filteredServiceRequests = filterExpiredOrDeclinedServiceRequests(serviceRequests);
    return size(filter(filteredServiceRequests, (x) => x.serviceProvider === uid));
};

export const becomeAffiliateExpertApplication = () => {
    return axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/affiliate_expert_application/`,
        withCredentials: false,
        headers: defaultHeaders,
//        data: values,
    });
}

export async function processCalendarEvents(sentServiceRequests, recievedServiceRequests) {
    const events = merge(sentServiceRequests, recievedServiceRequests);
    const result = map(events, (event) => {
        return {
            id: get(event, 'id'),
            title: get(event, 'subject'),
            description: get(event, 'description'),
            address: 'virtual',
            color: 'green',
            backgroundColor: 'transparent',
            textColor: '#000',
            start: get(event, 'date'),
            end: get(event, 'event_end'),
            allDay: false,
            status: get(event, 'status'),
            meetingLink: get(event, 'meetingLink'),
            extendedProps: {
                status: 'done',
            },
        };
    });
    return result;
}
