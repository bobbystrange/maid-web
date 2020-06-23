import {ajax} from "../config";


export function fileShare(sid, password, fid) {
    return ajax.post({
        url: `/share/file`,
        data: {sid, password, fid},
    });
}

export function listShare(sid, password, fid) {
    return ajax.post({
        url: `/share/list`,
        data: {sid, password, fid},
    });
}

export function listPathShare(sid, password, fid) {
    return ajax.post({
        url: `/share/list/path`,
        data: {sid, password, fid},
    });
}
