// 参考文档 https://axios-http.com/zh/docs/intro
import axios from "axios";

import {CustomError} from "./CustomError.js";

/**
 * axios 配置
 */
const service = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 5000 //请求超时时间(毫秒)
})

/**
 * axios 响应拦截器
 */
service.interceptors.response.use(
    (response) => {
        const { code } = response.data
        if (code !== 0) {
            return Promise.reject(new CustomError({ networkResponse: response.data }))
        } else if (code == 401) {
            console.warn('Unauthorized,logging out...')
        }

        return response.data.data
    },
    (error) => {
        console.error('request error', error);
        return Promise.reject(new CustomError({ error: error }))
    }
)

/**
 * GET 请求
 * @param {*} url 请求地址，相对路径
 * @param {*} params  请求参数，可选
 * @returns 
 */
export const get = (url, params = {}) => {
    return service.get(url, { params })
}

/**
 * POST请求
 * @param {*} url 请求地址，相对路径
 * @param {*} data 请求参数，可选
 * @returns 
 */
export const post = (url, data = {}) => {
    return service.post(url, data)
}