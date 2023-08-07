import axios from 'axios';
import { map, get, size, merge, filter } from 'lodash';
import { createId } from '../utils/uuid-generator';
import { defaultHeaders, getAuthId } from './Auth';

const uid = getAuthId();

export async function fetchFeed() {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/feed/`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}

export async function fetchFeedItem(feedItemRef) {
    return axios({
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/api/feed/${feedItemRef}`,
        withCredentials: false,
        headers: defaultHeaders,
    });
}
