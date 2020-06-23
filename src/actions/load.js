import ajax from "../config/ajax";

export function uploadFile({id, file, filename, onUploadProgress}) {
    const formData = new FormData();
    formData.append('file', file, filename);

    return ajax.post({
        url: `/file/upload?id=${id}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    }, false);

}

export function submitDownload(id, attachment) {
    return ajax.post({
        url: `/file/download?id=${id}&attachment=${attachment}`,
    });
}

export function downloadFile(path, filename) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', ajax.BASE_URL + "/file/download?path=" + path, true);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("If-Modified-Since", "0");
    xhr.responseType = "blob";
    xhr.onload = () => {
        if (xhr.status === 200) {
            let blob = xhr.response;
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.style = "visibility:hidden";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            // release resource;
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        } else {
            // showError(<FormattedMessage id="Download failed"/>);
        }
    };
    xhr.send();
}

export function shareFile({id, password, ttl}) {
    return ajax.post({
        url: `/file/share`,
        data: {id, password, ttl},
    });
}
