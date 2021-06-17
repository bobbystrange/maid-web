// bigint, 90071992547409910n
export function deepClone(obj) {
    if (typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Array) {
        const { length } = obj;
        if (length === 0) {
            return [];
        }
        const newObj = [];
        for (let i = 0; i < length; i++) {
            newObj.push(deepClone(obj[i]));
        }
        return newObj;
    }

    const newObj = {};
    Object.keys(obj).forEach((key) => {
        newObj[key] = deepClone(obj[key]);
    });
    return newObj;
}

function pruneEmpty(obj) {
    const current = deepClone(obj);
    Object.keys(current).forEach((key) => {
        const value = current[key];
        if (value === undefined || value === null || Number.isNaN(value)) {
            delete current[key];
        }
        if (typeof value === 'string' && value.length === 0) {
            delete current[key];
        }
        if (typeof value === 'object') {
            if (Object.keys(pruneEmpty(value)).length === 0) {
                delete current[key];
            }
            if (value instanceof Array) {
                current[key] = value.filter((it) => it !== undefined);
            }
        }
    });
    return current;
}

export function pruneObject(obj) {
    if (typeof obj !== 'object') {
        return obj;
    }
    return pruneEmpty(obj);
}

function recurseFlatObject(obj, key, map) {
    if (typeof obj !== 'object') {
        map[key] = String(obj);
        return;
    }

    Object.keys(obj).forEach((k) => {
        const v = obj[k];
        recurseFlatObject(v, key ? `${key}.${k}` : k, map);
    });
}

// {'a': {'b': {'c': 'd'}}}  -->  { 'a.b.c': 'd' }
export function flatObject(obj) {
    const map = {};
    recurseFlatObject(obj, undefined, map);
    return map;
}
