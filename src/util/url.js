export function queryStringToObject(query, alsoStatement = false) {
    let queryString = query;
    if (!queryString) {
        if (alsoStatement) {
            return {
                query: {},
                statement: '',
            };
        }
        return {};
    }

    const queryObject = {};
    let statement = '';
    const len = queryString.length;
    const i = queryString.indexOf('#');
    if (i !== -1) {
        if (alsoStatement && i !== len - 1) {
            statement = queryString.slice(i + 1);
        }
        queryString = queryString.slice(0, i);
    }
    queryString.split('&').forEach((value) => {
        const k = value.indexOf('=');
        if (k !== -1 && k !== value.length - 1) {
            queryObject[value.slice(0, k)] = value.slice(k + 1);
        }
    });

    if (alsoStatement) {
        return {
            query: queryObject,
            statement,
        };
    }
    return queryObject;
}

// based on window.location.search
export function getSearchValue(key, defaultValue) {
    let { search } = window.location;
    if (search) {
        search = search.slice(1);
        const query = queryStringToObject(search);
        if (query && query[key]) {
            if (typeof defaultValue === 'number') {
                let value = Number(query[key]);
                if (Number.isNaN(value)) value = defaultValue;
                return value;
            }
            return query[key];
        }
    }
    return defaultValue;
}

export function getOrigin() {
    return `${window.location.protocol}//${window.location.host}`;
}

export function openLink(url, target = undefined) {
    const link = document.createElement('a');
    link.href = url;
    link.style = 'visibility:hidden';
    if (target) link.target = target;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function openBlankLink(url) {
    openLink(url, '_blank');
}
