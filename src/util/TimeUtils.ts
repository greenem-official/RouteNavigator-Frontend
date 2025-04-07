import type {Moment} from "moment-timezone";
import moment from "moment-timezone";

export const mainTimeZone = 'Europe/Moscow';

export function formatMomentDate(moment: Moment) {
    return moment.clone().tz(mainTimeZone).format('YYYY-MM-DD');
}

export function formatMomentTime(moment: Moment) {
    return moment.clone().tz(mainTimeZone).format('HH:mm');
}

export function splitMoment(moment: Moment) {
    // console.log("getFormattedMoment");
    moment = moment.clone().tz(mainTimeZone);
    return {
        date: formatMomentDate(moment),
        time: formatMomentTime(moment),
    };
}

export function routeItemTimeFormatting(moment: Moment) {
    return moment.clone().tz(mainTimeZone).format('YYYY-MM-DD HH:mm');
}

export function calendarTimeFormatting(date: Moment) {
    return moment(date).format('DD/MM');
}
