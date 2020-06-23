import ajax from "../config/ajax";

export function getList(id) {
    return ajax.post({
            url: `/file/list`,
            data: {id},
        }
    );
}

export function getListPath(id) {
    return ajax.post({
            url: `/file/list/path`,
            data: {id},
        }
    );
}

export function submitRename(path, name) {
    return ajax.post({
            url: `/file/rename`,
            data: {path, name},
        }
    );
}

export function mkdir(folder, name) {
    return ajax.post({
            url: `/file/mkdir`,
            data: {id: folder, name},
        }
    );
}

export function deleteFile(id) {
    return ajax.post({
            url: `/file/rm`,
            data: {id},
        }
    );
}

export async function batchDelete(ids) {
    for (let i = 0, len = ids.length; i < len; i++) {
        let id = ids[i];
        await deleteFile(id);
    }
}


export function moveFile(fromId, toId) {
    return ajax.post({
            url: `/file/mv`,
            data: {fromId, toId},
        }
    );
}

export async function batchMove(fromIds, toId) {
    for (let i = 0, len = fromIds.length; i < len; i++) {
        await moveFile(fromIds[i], toId);
    }
}

export function copyFile(fromId, toId) {
    return ajax.post({
            url: `/file/cp`,
            data: {fromId, toId},
        }
    );
}

export async function batchCopy(fromIds, toId) {
    for (let i = 0, len = fromIds.length; i < len; i++) {
        await copyFile(fromIds[i], toId);
    }
}


//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////
