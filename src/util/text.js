// translate (\y\M\d \h\m\s \S \ \\) to (yMd hms S  \)
export function fromBackslash(str, backslash = '\\') {
    if (!str) return "";
    let newStr = [];
    let len = str.length;
    for (let i = 0; i < len; i++) {
        if (str[i] === '\\') {
            if (i === len - 1) {
                console.warn('Found unmatched backslash in the end of your string');
                newStr.push(str[i]);
                break;
            } else {
                newStr.push(str[++i]);
                continue;
            }
        }
        newStr.push(str[i]);
    }
    return newStr.join('');
}

export function anyMatch(str, ...patterns) {
    for (let i in patterns) {
        let pattern = patterns[i];
        if (RegExp(pattern).test(str)) return true;
    }
    return false;
}

export function allMatch(str, ...patterns) {
    for (let i in patterns) {
        let pattern = patterns[i];
        if (!RegExp(pattern).test(str)) return false;
    }
    return true;
}

export function anyExt(filename, ...exts) {
    for (let i in exts) {
        let ext = exts[i];
        if (RegExp(`.*\\.${ext}`).test(filename)) return true;
    }
    return false;
}

export function getTextWidth(text) {
    const sensor = document.createElement('pre');
    sensor.innerText = text;
    sensor.style.position = 'absolute';
    sensor.style.left = '-1000px';
    document.body.appendChild(sensor);
    const width = sensor.clientWidth;
    document.body.removeChild(sensor);
    return width;
}
