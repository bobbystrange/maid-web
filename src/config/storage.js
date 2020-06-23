function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function get(key) {
    return JSON.parse(localStorage.getItem(key));
}

function remove(key) {
    localStorage.removeItem(key);
}

// auth token, a loophole easy to attack
const TOKEN = "TOKEN";
// {username, email, firstName, lastName}
const USER = "USER";
const AVATAR = "AVATAR";
// [{id, name}]
const PATH = "PATH";
// dynamic load highlight css
const HIGHLIGHT_STYLE = "HIGHLIGHT_STYLE";

const storage = {
    // no json
    getToken() {
        return localStorage.getItem(TOKEN)
    },
    setToken(token) {
        localStorage.setItem(TOKEN, token)
    },
    removeToken() {
        localStorage.removeItem(TOKEN)
    },
    hasToken() {
        return this.getToken() !== null;
    },

    // current user
    hasUser() {
        return this.getUser() !== null;
    },
    getUser() {
        return get(USER);
    },
    setUser(user) {
        return set(USER, user);
    },
    removeUser() {
        return remove(USER);
    },
    hasAvatar() {
        return this.getAvatar() !== null;
    },
    getAvatar() {
        return localStorage.getItem(AVATAR)
    },
    setAvatar(avatar) {
        localStorage.setItem(AVATAR, avatar)
    },
    removeAvatar() {
        localStorage.removeItem(AVATAR)
    },
    getPath() {
        return get(PATH);
    },
    setPath(path) {
        return set(PATH, path);
    },
    removePath() {
        return remove(PATH);
    },
    // code highlight style
    setStyle(value) {
        localStorage.setItem(HIGHLIGHT_STYLE, value);
    },
    getStyle() {
        return localStorage.getItem(HIGHLIGHT_STYLE);
    },
    removeStyle() {
        localStorage.removeItem(HIGHLIGHT_STYLE);
    },

    removeAllExceptToken() {
        storage.removeUser();
        storage.removeAvatar();
        storage.removeStyle();
    },
    removeAll() {
        storage.removeAllExceptToken();
        storage.removeToken();
    },

};

export default storage;
