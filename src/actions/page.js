import ajax from "../config/ajax";
import {pushForcibly} from "../util/module/history";

export function fetchCategory({category, last, size}) {
    return ajax.post({
            url: `/file/page/category`,
            data: {category, last, size},
        }
    );
}

export function fetchShare({last, size}) {
    return ajax.post({
            url: `/file/page/share`,
            data: {last, size},
        }
    );
}


//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

export const categories = [
    {name: 'all', icon: 'files-o',},
    {name: 'image', icon: 'picture-o',},
    {name: 'document', icon: 'file-text',},
    {name: 'video', icon: 'video-camera',},
    {name: 'audio', icon: 'music',},
    {name: 'torrent', icon: 'file-text-o',},
    {name: 'other', icon: 'file-o',},
    {name: 'trash', icon: 'trash',},
]

export function getCategory() {
    const pathname = window.location.pathname
    if (/^\/category\/([^/]+?)$/.test(pathname)) {
        return RegExp.$1
    }
    if (pathname === '/trash') {
        return 'trash'
    }
    if (pathname === '/') {
        return 'all'
    }
    return null
}

export function setCategory(category) {
    if (category === 'all') {
        pushForcibly("/")
        return
    }
    if (category === 'trash') {
        pushForcibly("/trash")
        return
    }
    pushForcibly(`/category/${category}`)
}
