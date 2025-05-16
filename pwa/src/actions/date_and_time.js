import moment from 'moment';

export const defaultDateAndTimeDisplay = dateTime => moment(dateTime).format('dddd, MMMM Do YYYY, h:mm:ss a');
