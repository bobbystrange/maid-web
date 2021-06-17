// translate (\y\M\d \h\m\s \S \ \\) to (yMd hms S  \)
export function fromBackslash(str, backslash = '\\') {
    if (!str) return '';
    const newStr = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
        if (str[i] === backslash) {
            if (i === len - 1) {
                newStr.push(str[i]);
                break;
            } else {
                i += 1;
                newStr.push(str[i]);
                continue;
            }
        }
        newStr.push(str[i]);
    }
    return newStr.join('');
}

export function anyMatch(str, ...patterns) {
    const { length } = patterns;
    for (let i = 0; i < length; i++) {
        const pattern = patterns[i];
        if (RegExp(pattern).test(str)) return true;
    }
    return false;
}

export function allMatch(str, ...patterns) {
    const { length } = patterns;
    for (let i = 0; i < length; i++) {
        const pattern = patterns[i];
        if (!RegExp(pattern).test(str)) return false;
    }
    return true;
}

export function anyExt(filename, ...exts) {
    const { length } = exts;
    for (let i = 0; i < length; i++) {
        const ext = exts[i];
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
