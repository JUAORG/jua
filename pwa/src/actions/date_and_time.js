import moment from 'moment'

export const defaultDateAndTimeDisplay = (dateTime) => {
    return moment(dateTime).format("dddd, MMMM Do YYYY, h:mm:ss a")
}
