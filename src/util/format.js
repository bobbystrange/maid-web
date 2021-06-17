// 94 chars, no \t\n\r\0 and :
const ASICC_PERMITTED_CHARSET =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~!@#$%^&*()_+-= ,./<>?;\'"[]{}\\|';

export function normalizeFilename(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }

    const { length } = name;
    const cs = [];
    for (let i = 0; i < length; i++) {
        const c = name[i];
        if (name.charCodeAt(i) > 127) {
            cs.push(c);
        } else if (ASICC_PERMITTED_CHARSET.indexOf(c) !== -1) {
            cs.push(c);
        }
    }

    return cs.join('').replace(/\/+/, '/');
}

// formatByteSize(1<<19), '524,288'
// formatByteSize(1<<20), '1,048,576'
export function formatByteSizeNum(size) {
    const cs = [];
    const ns = `${size}`.split('').reverse();
    ns.forEach((n, i) => {
        cs.push(n);
        if (i % 3 === 2 && i !== ns.length - 1) {
            cs.push(',');
        }
    });
    return cs.reverse().join('');
}

// formatByteSize(1<<19), '524 KB'
// formatByteSize(1<<20), '1,048,576'
export function formatByteSize(size) {
    if (size < 2 ** 10) {
        return `${size} B`;
    }
    if (size < 2 ** 20) {
        return `${(size / 2 ** 10).toFixed(2)} KB`;
    }
    if (size < 2 ** 30) {
        return `${(size / 2 ** 20).toFixed(2)} MB`;
    }
    if (size < 2 ** 40) {
        return `${(size / 2 ** 30).toFixed(2)} GB`;
    }
    return `${(size / 2 ** 40).toFixed(2)} TB`;
}
