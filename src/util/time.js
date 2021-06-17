import { fromBackslash } from './text';

const nf = (v) => `${v < 10 ? `0${v}` : v}`;
const nf2 = (v) => `${v < 10 ? `00${v}` : v < 100 ? `0${v}` : v}`;
const monthF = (v) =>
    [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ][v - 1];
const monthF2 = (v) =>
    [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ][v - 1];
const quarterF = (v) => ['Spring', 'Summer', 'Autumn', 'Winter'][v - 1];
const dayF = (v) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][v];
const dayF2 = (v) =>
    [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ][v];

/**
 * format a js date
 * @param date, Date object/unix millisecond
 * @param format format string
 * @returns {string}
 */
export function dateFormat(date, format) {
    let fmt = fromBackslash(format);
    if (!fmt) return '';

    let d = date;
    if (typeof d === 'number') {
        d = new Date(d);
    } else if (typeof d === 'string') {
        d = new Date(d);
    }

    const o = [
        ['yyyy', d.getFullYear()],
        ['yy', d.getFullYear() % 100],
        ['y', d.getFullYear() % 100],
        ['MMMM', d.getMonth() + 1, monthF2],
        ['MMM', d.getMonth() + 1, monthF],
        ['MM', d.getMonth() + 1, nf],
        ['M', d.getMonth() + 1],
        ['dd', d.getDate(), nf],
        ['d', d.getDate()],
        ['hh', d.getHours(), nf],
        ['h', d.getHours()],
        ['mm', d.getMinutes(), nf],
        ['m', d.getMinutes()],
        ['ss', d.getSeconds(), nf],
        ['s', d.getSeconds()],
        ['SSS', d.getMilliseconds(), nf2],
        ['SS', d.getMilliseconds()],
        ['S', d.getMilliseconds()],
        ['Q', Math.floor((d.getMonth() + 3) / 3), quarterF],
        ['q', Math.floor((d.getMonth() + 3) / 3)],
        ['w', d.getDay()],
        ['W', d.getDay(), dayF],
        ['WW', d.getDay(), dayF2],
    ];

    const { length } = o;
    for (let i = 0; i < length; i++) {
        const obj = o[i];
        const k = obj[0];
        let v = obj[1];
        const f = obj[2];
        if (f) v = f(v);
        while (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, `${v}`);
        }
    }
    return fmt;
}

export function yyMMdd(date) {
    return dateFormat(date, 'yy.MM.dd');
}

export function yyyyMMdd(date) {
    return dateFormat(date, 'yyyy-MM-dd');
}

export function yyyyMMddhhmm(date) {
    return dateFormat(date, 'yyyy-MM-dd hh:mm');
}

/// / //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

export function getRelativeTime(timestamp) {
    let timeValue = (timestamp - new Date().getTime()) / 1000;
    let sign = 1;
    if (timeValue < 0) {
        timeValue = -timeValue;
        sign = -1;
    }

    let timeUnit;
    if (timeValue < 120) {
        timeUnit = 'second';
    } else {
        timeValue /= 60;
        if (timeValue < 120) {
            timeUnit = 'minute';
        } else {
            timeValue /= 60;
            if (timeValue < 48) {
                timeUnit = 'hour';
            } else {
                timeValue /= 24;
                if (timeValue < 60) {
                    timeUnit = 'day';
                } else {
                    timeValue /= 30;
                    if (timeValue < 24) {
                        timeUnit = 'month';
                    } else {
                        timeValue /= 12;
                        timeUnit = 'year';
                    }
                }
            }
        }
    }

    timeValue = sign * Math.ceil(timeValue);
    return { timeValue, timeUnit };
}
