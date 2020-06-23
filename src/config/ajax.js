import axios from 'axios'
import {storage} from '.';
import {pushForcibly} from '../util/module/history';
import {pruneObject} from "../util";

const BASE_URL = `http://api.maid.singlar.org/v1`;
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = false;
axios.defaults.headers['content-type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(
    config => {
        // set Auth Http Header
        const token = storage.getToken();
        if (token) {
            config.headers['authorization'] = token
        }
        return config;
    }, err => {
        return Promise.reject(err);
    });

axios.interceptors.response.use(
    res => {
        // server endpoint require client endpoint to update its token
        const token = res.headers['authorization'];

        if (token) {
            storage.setToken(token);
        }
        return res;
    }, err => {
        if (err.response) {
            // invalid token, go to login share
            if (err.response.status === 401) {
                storage.removeToken();
                // let pathname = history.location.pathname
                pushForcibly('/login');
            }
        } else if (err.request) {
            console.error(err.request);
        } else {
            console.error('Error', err.message);
        }
        return Promise.reject(err);
    });

const ajax = {
    request(method, {url, data, params, headers = {}, ...config}, prune) {
        return new Promise((resolve, reject) => {
            axios({
                method: method.toLowerCase(),
                url: url,
                headers: headers,
                data: prune ? pruneObject(data) : data,
                params: prune ? pruneObject(params) : params,
                ...config,
            }).then(res => {
                // pass the response object to the returned promise
                resolve(res)
            }, err => {
                if (!err.Cancel) {
                    reject(err)
                }
            }).catch(err => {
                reject(err)
            })
        })
    },
    get(options, prune = true) {
        return ajax.request("get", options, prune);
    },
    post(options, prune = true) {
        return ajax.request("post", options);
    },
    put(options, prune = true) {
        return ajax.request("put", options);
    },
    del(options, prune = true) {
        return ajax.request("delete", options);
    },
    isCancel(err) {
        return axios.isCancel(err);
    },
    BASE_URL: BASE_URL,
};

export default ajax;
