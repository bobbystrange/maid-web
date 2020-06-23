import {ajax} from "../config";

export function fetchUser() {
    return ajax.get({
        url: '/user',
    });
}

export function updateUser({gender, style, birthday, email, username, firstName, lastName}) {
    return ajax.put({
        url: '/user',
        data: {gender, style, birthday, email, username, firstName, lastName}
    });
}

export function getUsernameValidity(username) {
    return ajax.get({
        url: `/user/validity/username/${username}`,
    });
}

export function getEmailValidity(email) {
    return ajax.get({
        url: `/user/validity/email/${email}`,
    });
}

export function fetchAvatar() {
    return ajax.get({
        url: "/user/avatar",
    })
}

export function updateAvatar(avatar) {
    return ajax.post({
        url: "/user/avatar",
        data: {avatar}
    })
}

//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

