import {anyExt, anyMatch, dateFormat, formatByteSize, getRelativeTime, getSearchValue} from "../util";

export function visualizeFile(file) {
    let {id, pid, name, mtime, type, size, count} = file;
    let {isFolder, iconName, iconColor} = getIconFromType(type, name, count)

    return {
        id, pid,
        chosen: false,
        editing: false,

        // undefined if file
        count,
        // for rename
        originalName: name,
        iconName,
        iconColor,
        type,
        isFolder,

        name,

        mtime: mtime,
        mtimeStr: dateFormat(mtime, "yyyy/MM/dd hh:mm"),

        size: size ? size : 0,
        sizeStr: size ? formatByteSize(size) : "-",
    }
}

export function visualizeFiles(files) {
    return files.map((file, i) => visualizeFile(file));
}

export function sortFiles(files) {
    let sort = getSearchValue('sort', 'name');
    let order = getSearchValue('order', 'asc');

    if (!sort) sort = 'name';
    return files.sort((a, b) =>
        (order === 'desc' ? a[sort] < b[sort] : a[sort] > b[sort]) ? 1 : -1
    );
}

// {id, fid, name, ctime, password, ttl, type, size}

export function visualizeShareFile(file) {
    let {id, fid, name, ctime, password, ttl, type, size} = file
    let {isFolder, iconName, iconColor} = getIconFromType(type, name, 1)

    const etime = ctime + ttl * 1000
    let {timeValue: etimeValue, timeUnit: etimeUnit} = getRelativeTime(etime)
    if (etimeValue < 0) {
        etimeUnit = undefined
        etimeValue = undefined
    }

    return {
        sid: id,
        fid,
        name,
        isFolder, iconName, iconColor,
        ctime,
        ctimeStr: dateFormat(ctime, "yyyy/MM/dd hh:mm"),
        etime,
        etimeStr: dateFormat(etime, "yyyy/MM/dd hh:mm"),
        etimeValue,
        etimeUnit,
        size: size ? size : 0,
        sizeStr: size ? formatByteSize(size) : "-",
        password,
        ttl,
        chosen: false,
    }
}

export function visualizeShareFiles(files) {
    return files.map((file, i) => visualizeShareFile(file));
}

//// //// ////    //// //// ////    //// //// ////    //// //// ////    //// //// ////

function getIconFromType(type, name, count) {
    let isFolder = false, iconName, iconColor
    if (type === undefined) {
        isFolder = true;
        if (count !== undefined && count > 0) {
            iconName = 'folder'
        } else {
            iconName = 'folder open';
        }
        iconColor = "#8ad0f7"
    }
    // rich text
    else if (anyMatch(type, "application/pdf")) {
        iconName = 'file pdf'
        iconColor = 'red'
    } else if (anyMatch(type, "application/vnd\\.ms-powerpoint")) {
        iconName = 'file pdf'
        iconColor = '#8ad0f7'
    } else if (anyMatch(type, "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        iconName = 'file word'
        iconColor = 'teal'
    } else if (anyMatch(type, "application/vnd\\.ms-excel")) {
        iconName = 'file excel'
        iconColor = '#8ad0f7'
    }
    // text
    else if (anyMatch(type, "text/css", "text/html", "application/x-javascript",
        "application/x-csh", "application/x-sh",
        "text/x-web-markdown", "text/markdown")) {
        iconName = 'file code'
        iconColor = 'green'
    } else if (anyMatch(type, "text/.+")) {
        iconName = 'file text'
        iconColor = 'olive'
    }
    // archive
    else if (anyMatch(type, "application/x-gtar", "application/x-gzip",
        "application/zip", "application/x-compressed", "application/x-compress",
        "application/x-rar-compressed", "application/x-zip-compressed")) {
        iconName = 'file archive'
        iconColor = 'brown'
    }
    // image
    else if (anyMatch(type, "image/.+")) {
        iconName = 'file image';
        iconColor = 'teal';
    }
    // video
    else if (anyMatch(type, "video/.+")) {
        iconName = 'file video';
        iconColor = 'violet';
    }
    // audio
    else if (anyMatch(type, "audio/.+")) {
        iconName = 'file audio';
        iconColor = 'orange';
    }
    // via ext name
    else {
        if (anyExt(name, "tar", "ar", "bz2", "gz", "xz", "zip", "7z", "z", "rar")) {
            iconName = 'file archive'
            iconColor = '#8ad0f7'
        } else {
            iconName = 'file'
            iconColor = '#8ad0f7'
        }
    }

    return {isFolder, iconName, iconColor}
}

